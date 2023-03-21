{-# LANGUAGE Arrows #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE BangPatterns #-}

module LibMain ( startApp ) where

import FRP.Yampa ( integral, time, returnA, SF, reactimate )

import Control.Lens ( makeLenses, (&), (.~), (?~) )

import Data.Time.Clock

import Data.Aeson.TH
    ( deriveJSON,
      defaultOptions,
      Options(constructorTagModifier, fieldLabelModifier) )

import Data.Char (toLower)

import Data.Aeson.Casing ( snakeCase )

import GameData ( GameInput, GameOutput, newGameOutput, newGameInput )

import Data.Foldable (find)
import qualified Data.ByteString as B
import Data.Aeson (decode, encode)
import qualified Data.ByteString.Builder as BB
import Network.WebSockets (runServer, ServerApp, acceptRequest, receive, Message (ControlMessage, DataMessage), receiveDataMessage, sendTextData)
import qualified Network.WebSockets as W
import Control.Concurrent (forkIO, newEmptyMVar, threadDelay)
import Control.Concurrent.STM (newTQueue, newTQueueIO, atomically, writeTQueue, readTQueue, flushTQueue, tryReadTQueue, newTVar, newTVarIO, writeTVar, readTVar, readTVarIO)
import Control.Monad
import FRP.Yampa.Task (sleepT)

yumeserver :: SF GameInput GameOutput
yumeserver = proc x -> do
  let def = newGameOutput []
  returnA -< def

startApp :: IO ()
startApp = do
  timeRef <- newTVarIO =<< getCurrentTime
  input_queue <- newTQueueIO
  output_queue <- newTQueueIO
  forkIO $ reactimate (return $ newGameInput [])
    (\b -> do
      x <- atomically (readTQueue input_queue)
      t1 <- getCurrentTime
      t2 <- readTVarIO timeRef
      atomically (writeTVar timeRef t2)
      let dt = t2 `diffUTCTime` t1
      return (realToFrac dt, Just x))
    (\_ o -> do
      unless (o == newGameOutput []) $ atomically (writeTQueue output_queue o)
      return False) yumeserver

  runServer "0.0.0.0" 9435 (\req -> do
      con <- acceptRequest req
      let procA = do
            mes <- receiveDataMessage con
            case mes of
              W.Text bs _ -> do
                case decode bs :: Maybe GameInput of
                  Just i -> atomically (writeTQueue input_queue i)
                  Nothing -> return ()
            procA

          procB = do
            o <- atomically (readTQueue output_queue)
            sendTextData con (encode (o :: GameOutput))
            procB

      forkIO procA
      procB

      return ())

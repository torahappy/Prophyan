{-# LANGUAGE Arrows #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE BangPatterns #-}

module LibMain ( startApp ) where

import FRP.Yampa ( integral, time, returnA, SF, reactimate )

import Control.Lens ( makeLenses, (&), (.~), (?~) )

import Data.Aeson.TH
    ( deriveJSON,
      defaultOptions,
      Options(constructorTagModifier, fieldLabelModifier) )

import Data.Char (toLower)

import Data.Aeson.Casing ( snakeCase )

import GameData ( GameInput, GameOutput, newGameOutput, newGameInput, isEmptyGameOutput )

import Data.Foldable (find)
import qualified Data.ByteString as B
import Data.Aeson (decode, encode)
import qualified Data.ByteString.Builder as BB
import Network.WebSockets (runServer, ServerApp, acceptRequest, receive, Message (ControlMessage, DataMessage), receiveDataMessage, sendTextData)
import qualified Network.WebSockets as W
import Control.Concurrent (forkIO, newEmptyMVar)
import Control.Concurrent.STM (newTQueue, newTQueueIO, atomically, writeTQueue, readTQueue, flushTQueue, tryReadTQueue, newTVar, newTVarIO, writeTVar, readTVar)
import Control.Monad

yumeserver :: SF GameInput GameOutput
yumeserver = proc x -> do
  let def = newGameOutput
  returnA -< def

startApp :: IO ()
startApp = do
  cnt <- newTVarIO (0 :: Int)
  input_queue <- newTQueueIO
  output_queue <- newTQueueIO
  forkIO $ reactimate (return newGameInput)
    (\b -> do
      x <- atomically (tryReadTQueue input_queue)
      case x of
        Just _ -> return (0.1, x)
        Nothing -> return (0.1, Nothing))
    (\b o -> do
      unless (isEmptyGameOutput o) $ atomically (writeTQueue output_queue o)

      t <- atomically $ do
        t <- readTVar cnt
        writeTVar cnt (t + 1)
        return t
      print t

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

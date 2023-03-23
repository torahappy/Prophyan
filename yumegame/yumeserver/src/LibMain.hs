{-# LANGUAGE Arrows #-}
{-# LANGUAGE OverloadedStrings #-}
{-# OPTIONS_GHC -Wno-unrecognised-pragmas #-}
{-# HLINT ignore "Use if" #-}

module LibMain ( startApp ) where

import FRP.Yampa ( integral, time, returnA, SF, reactimate, Event, noEvent, maybeToEvent, isEvent, fromEvent )

import Control.Lens ( makeLenses, (&), (.~), (?~) )

import Data.Time.Clock

import Data.Aeson.TH
    ( deriveJSON,
      defaultOptions,
      Options(constructorTagModifier, fieldLabelModifier) )

import Data.Char (toLower)

import Data.Aeson.Casing ( snakeCase )

import GameData (GameEvent)

import Data.Foldable (find)
import qualified Data.ByteString as B
import Data.Aeson (decode, encode)
import qualified Data.ByteString.Builder as BB
import Network.WebSockets (runServer, ServerApp, acceptRequest, receive, Message (ControlMessage, DataMessage), receiveDataMessage, sendTextData)
import qualified Network.WebSockets as W
import Control.Concurrent (forkIO, newEmptyMVar, threadDelay)
import Control.Concurrent.STM (newTQueue, newTQueueIO, atomically, writeTQueue, readTQueue, flushTQueue, tryReadTQueue, newTVar, newTVarIO, writeTVar, readTVar, readTVarIO, TQueue)
import Control.Monad
import FRP.Yampa.Task (sleepT)
import Control.Lens.Internal.Getter (noEffect)
import Data.Maybe (isJust)

mapArrow :: SF x y -> SF [x] [y]
mapArrow a = proc (x:xs) -> do
  y <- a -< x
  z <- mapArrow a -< xs
  returnA -< y:z

yumeserver :: SF (Event GameEvent) (Event GameEvent)
yumeserver = proc evs -> do
  returnA -< noEvent

startApp :: IO ()
startApp = do
  timeRef <- newTVarIO =<< getCurrentTime
  input_arrived <- newTVarIO False

  input_queue <- newTQueueIO :: IO (TQueue GameEvent)
  output_queue <- newTQueueIO :: IO (TQueue GameEvent)

  forkIO $ reactimate (return noEvent)
    (\b -> do
      -- -- --
      x <- atomically $ do
        i <- readTVar input_arrived
        case i of
          True -> do
            writeTVar input_arrived False
            return noEvent
          False -> do
            x' <- tryReadTQueue input_queue
            when (isJust x') (writeTVar input_arrived True)
            return (maybeToEvent x')
      -- -- --
      threadDelay 1000 -- 1 ms delay
      t1 <- getCurrentTime
      t2 <- atomically $ do
        t2 <- readTVar timeRef
        writeTVar timeRef t1
        return t2
      -- -- --
      let dt = t1 `diffUTCTime` t2
      return (realToFrac dt, Just x))
    (\b o -> do
      when (isEvent o) $ atomically (writeTQueue output_queue (fromEvent o))
      return False) yumeserver

  runServer "0.0.0.0" 9435 (\req -> do
      con <- acceptRequest req
      let procA = do
            mes <- receiveDataMessage con
            case mes of
              W.Text bs _ -> do
                case decode bs :: Maybe GameEvent of
                  Just i -> atomically (writeTQueue input_queue i)
                  Nothing -> return ()
            procA

          procB = do
            o <- atomically (readTQueue output_queue)
            sendTextData con (encode (o :: GameEvent))
            procB

      forkIO procA
      procB

      return ())

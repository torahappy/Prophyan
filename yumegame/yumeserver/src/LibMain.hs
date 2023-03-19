{-# LANGUAGE Arrows #-}
{-# LANGUAGE OverloadedStrings #-}

module LibMain ( startApp ) where

import FRP.Yampa ( integral, time, returnA, SF )

import Control.Lens ( makeLenses )

import Data.Aeson.TH
    ( deriveJSON,
      defaultOptions,
      Options(constructorTagModifier, fieldLabelModifier) )

import Data.Char (toLower)

import Data.Aeson.Casing ( snakeCase )

import GameData ( GameInput, GameOutput, newGameOutput )

import Network.Wai
    ( Request(requestHeaders),
      Application,
      responseBuilder,
      getRequestBodyChunk )
import Network.Wai.Handler.Warp ( run )
import Network.HTTP.Types ( status200, status400 )
import Data.Foldable (find)
import qualified Data.ByteString as B
import Data.Aeson (decode, encode)
import qualified Data.ByteString.Builder as BB

yumeserver :: SF GameInput GameOutput
yumeserver = proc x -> do
  let def = newGameOutput
  returnA -< def

webApp :: Application
webApp req respond = do
  let headers = requestHeaders req
      baseHeader = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")]

  case find (\(x, y) -> x == "Content-Type") headers of
      Just (x, y) -> do
            let getAllBody = do
                  chunk <- getRequestBodyChunk req
                  if chunk == "" then return [] else do
                      body <- getAllBody
                      return (chunk : body)
            body <- B.concat <$> getAllBody
            let parsed = decode (B.fromStrict body) :: Maybe GameInput
            case parsed of
                Just x -> respond $ responseBuilder status200 baseHeader (BB.byteString body)
                Nothing -> respond $ responseBuilder status400 baseHeader "{\"error\": \"ERROR! json parse failed\"}"
      Nothing -> respond $ responseBuilder status400 baseHeader "{\"error\": \"ERROR! please set Content-Type to application/json\"}"

startApp :: IO ()
startApp = run 9435 webApp

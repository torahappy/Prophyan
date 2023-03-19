{-# LANGUAGE Arrows #-}
{-# LANGUAGE TemplateHaskell #-}

module LibMain ( yumeserver ) where

import System.Environment

import FRP.Yampa ( integral, time, returnA, SF )

import Control.Lens ( makeLenses )

import Data.Aeson.TH
    ( deriveJSON,
      defaultOptions,
      Options(constructorTagModifier, fieldLabelModifier) )

import Data.Char (toLower)

import Data.Aeson.Casing


-- | simple signal function
signalFunction :: SF Double Double
signalFunction = proc x -> do
  y <- integral -< x
  t <- time     -< ()
  returnA -< y / t

newtype Vec3 = Vec3 (Int, Int, Int)
$(deriveJSON defaultOptions ''Vec3)

data Object =
  Cube String Vec3 Vec3 Vec3 |
  Sphere String Vec3 Vec3 Vec3
$(deriveJSON defaultOptions{constructorTagModifier = snakeCase} ''Object)

data GameInput = GameInput { _key :: Maybe Int }
makeLenses ''GameInput
$(deriveJSON defaultOptions{fieldLabelModifier = drop 1, constructorTagModifier = snakeCase} ''GameInput)

data GameOutput = GameOutput { _newObj :: Maybe Object, _soundFeed :: Maybe [Int], _playerPos :: Maybe Vec3 }
makeLenses ''GameOutput
$(deriveJSON defaultOptions{fieldLabelModifier = drop 1, constructorTagModifier = snakeCase} ''GameOutput)

yumeserver :: SF GameInput GameOutput
yumeserver = proc x -> do
  let def = GameOutput { _newObj = Nothing, _soundFeed = Nothing, _playerPos = Nothing }
  returnA -< def

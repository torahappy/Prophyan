{-# LANGUAGE Arrows #-}
{-# LANGUAGE TemplateHaskell #-}

module GameData (Vec3, Object, GameInput, GameOutput, key, newObj, soundFeed, playerPos, newGameOutput) where

import FRP.Yampa ( integral, time, returnA, SF )

import Data.Aeson.Casing ( snakeCase )

import Data.Aeson.TH
    ( deriveJSON,
      defaultOptions,
      Options(constructorTagModifier, fieldLabelModifier) )

import Control.Lens ( makeLenses )

newtype Vec3 = Vec3 (Double, Double, Double)
$(deriveJSON defaultOptions ''Vec3)

data Object =
  Cube String Vec3 Vec3 Vec3 |
  Sphere String Vec3 Vec3 Vec3
$(deriveJSON defaultOptions{constructorTagModifier = snakeCase} ''Object)

data GameInput = GameInput { _key :: Maybe Int }
makeLenses ''GameInput
$(deriveJSON defaultOptions{fieldLabelModifier = drop 1, constructorTagModifier = snakeCase} ''GameInput)
newGameInput = GameInput { _key = Nothing }

data GameOutput = GameOutput { _newObj :: Maybe Object, _soundFeed :: Maybe [Int], _playerPos :: Maybe Vec3 }
makeLenses ''GameOutput
$(deriveJSON defaultOptions{fieldLabelModifier = drop 1, constructorTagModifier = snakeCase} ''GameOutput)
newGameOutput = GameOutput { _newObj = Nothing, _soundFeed = Nothing, _playerPos = Nothing}


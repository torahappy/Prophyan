{-# LANGUAGE Arrows #-}
{-# LANGUAGE TemplateHaskell #-}

module GameData (Vec3, Object, GameInput, GameOutput, isEmptyGameOutput, newGameOutput, newGameInput) where

import FRP.Yampa ( integral, time, returnA, SF )

import Data.Aeson.Casing ( snakeCase )

import Data.Aeson.TH
    ( deriveJSON,
      defaultOptions,
      Options(constructorTagModifier, fieldLabelModifier) )

import Control.Lens ( makeLenses )

newtype Vec3 = Vec3 (Double, Double, Double)  deriving( Eq )
$(deriveJSON defaultOptions ''Vec3)

data Object =
  Cube String Vec3 Vec3 Vec3 |
  Sphere String Vec3 Vec3 Vec3  deriving( Eq )
$(deriveJSON defaultOptions ''Object)

data UIElement = Button String Vec3  deriving( Eq )
$(deriveJSON defaultOptions ''UIElement)

newtype UIConfig = UIConfig [UIElement]   deriving( Eq )
$(deriveJSON defaultOptions ''UIConfig)

data GameInput = GameInput { _key :: Maybe Int, _uiClick :: Maybe String } deriving( Eq )
makeLenses ''GameInput
$(deriveJSON defaultOptions{fieldLabelModifier = drop 1} ''GameInput)
newGameInput = GameInput { _key = Nothing, _uiClick = Nothing }

data GameOutput = GameOutput { _newObj :: Maybe Object, _soundFeed :: Maybe [Int], _playerPos :: Maybe Vec3, _updateUI :: Maybe UIConfig }  deriving( Eq )
makeLenses ''GameOutput
$(deriveJSON defaultOptions{fieldLabelModifier = drop 1} ''GameOutput)
newGameOutput = GameOutput { _newObj = Nothing, _soundFeed = Nothing, _playerPos = Nothing, _updateUI = Nothing }
isEmptyGameOutput x = x == newGameOutput

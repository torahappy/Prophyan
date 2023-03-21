{-# LANGUAGE Arrows #-}
{-# LANGUAGE TemplateHaskell #-}

module GameData (Vec3, Object, GameInput, GameOutput, newGameOutput, newGameInput) where

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

data GameEvent = KeyEvent Int |
          UIClickEvent String |
        NewObjectEvent Object |
         SoundFeedEvent [Int] |
     PlayerPositionEvent Vec3 |
       UpdateUIEvent UIConfig
       deriving( Eq )

$(deriveJSON defaultOptions ''GameEvent)

newtype GameInput = GameInput [GameEvent] deriving( Eq )
$(deriveJSON defaultOptions ''GameInput)
newGameInput = GameInput

newtype GameOutput = GameOutput [GameEvent] deriving( Eq )
$(deriveJSON defaultOptions ''GameOutput)
newGameOutput = GameOutput

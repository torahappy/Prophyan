{-# LANGUAGE Arrows #-}
{-# LANGUAGE TemplateHaskell #-}

module GameData (
    GameInput (..), 
    GameOutput (..), 
    GameEvent (..), 
    RootState (..), 
    UIConfig (..), 
    UIElement (..), 
    Object (..), 
    Vec3(..)) where

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

data RootState = RootState deriving Eq
$(deriveJSON defaultOptions ''RootState)

data GameEvent = 
               StartGameEvent | -- i
                 KeyEvent Int | -- i
          UIClickEvent String | -- i
        NewObjectEvent Object | -- o
         SoundFeedEvent [Int] | -- o
     PlayerPositionEvent Vec3 | -- i
       UpdateUIEvent UIConfig | -- o
                LoadGameEvent | -- i
                SaveGameEvent | -- i
  SaveGameFeedEvent RootState | -- o
                 EndGameEvent   -- i
       deriving ( Eq )
$(deriveJSON defaultOptions ''GameEvent)

newtype GameInput = GameInput [GameEvent] deriving( Eq )
$(deriveJSON defaultOptions ''GameInput)

newtype GameOutput = GameOutput [GameEvent] deriving( Eq )
$(deriveJSON defaultOptions ''GameOutput)

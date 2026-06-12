{-# LANGUAGE Arrows #-}
{-# LANGUAGE TemplateHaskell #-}

module GameData (
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

data Material = SimpleMaterial String | DynamicMaterial String [Double] deriving( Eq )
$(deriveJSON defaultOptions ''Material)

data Object =
  Cube Material Vec3 Vec3 Vec3 |
  Sphere Material Vec3 Vec3 Vec3  deriving( Eq )
$(deriveJSON defaultOptions ''Object)

data ObjectWithID = ObjectWithID String Object deriving ( Eq )
$(deriveJSON defaultOptions ''ObjectWithID)

data UIElement = Button String Vec3  deriving ( Eq )
$(deriveJSON defaultOptions ''UIElement)

newtype UIConfig = UIConfig [UIElement]   deriving ( Eq )
$(deriveJSON defaultOptions ''UIConfig)

data RootState = RootState deriving ( Eq )
$(deriveJSON defaultOptions ''RootState)

data GameEvent = 
               StartGameEvent | -- i
                 KeyEvent Int | -- i
          UIClickEvent String | -- i
        NewObjectEvent ObjectWithID | -- o
         SoundFeedEvent [Int] | -- o
     PlayerPositionEvent Vec3 | -- i
       UpdateUIEvent UIConfig | -- o
                LoadGameEvent | -- i
                SaveGameEvent | -- i
  SaveGameFeedEvent RootState | -- o
                 EndGameEvent   -- i
       deriving ( Eq )
$(deriveJSON defaultOptions ''GameEvent)

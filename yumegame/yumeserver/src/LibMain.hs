{-# LANGUAGE Arrows #-}

module LibMain ( yumeserver ) where

import FRP.Yampa ( integral, time, returnA, SF )

import Control.Lens ( makeLenses )

import Data.Aeson.TH
    ( deriveJSON,
      defaultOptions,
      Options(constructorTagModifier, fieldLabelModifier) )

import Data.Char (toLower)

import Data.Aeson.Casing ( snakeCase )

import GameData ( GameInput, GameOutput, newGameOutput )

yumeserver :: SF GameInput GameOutput
yumeserver = proc x -> do
  let def = newGameOutput
  returnA -< def

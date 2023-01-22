{-# LANGUAGE RecursiveDo #-}

module LibMain ( startApp ) where

import System.Environment
import Reflex.Dom

-- | start the app
startApp :: IO ()
startApp = do
  args <- getArgs
  mainWidget $ mdo
    return ()

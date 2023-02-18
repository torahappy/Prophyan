while IFS== read -r key value; do
  printf -v "$key" %s "$value" && export "$key"
done < ~/envfile

cd /home/nix/Prophyan/reflex/frontend/
cabal build
dist-newstyle/build/x86_64-linux/ghc-*/MyReflexProject-*/x/MyReflexProject-exe/build/MyReflexProject-exe/MyReflexProject-exe

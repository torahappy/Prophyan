docker build . -t nix-reflex
docker stop reflex
docker rm reflex
docker run --name reflex -it nix-reflex /bin/bash
docker start reflex
sh build-src.sh
docker build . -t nix-reflex
docker stop reflex
docker rm reflex
echo "echo OK" | docker run -p 2525:22 --name reflex -i nix-reflex /bin/bash
docker start reflex
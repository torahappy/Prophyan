docker exec reflex /bin/bash -c "sudo rm -rf ~/Prophyan"
docker cp ../ reflex:/home/nix/Prophyan
docker exec reflex /bin/bash -c "sudo chown -R nix:nix ~/Prophyan; sudo chmod -R 755 ~/Prophyan; cd ~/Prophyan/reflex; . ~/e.sh; nix-build -o ./build-ghcjs -A ghcjs.MyReflexProject --show-trace"
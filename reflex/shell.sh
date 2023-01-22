docker exec reflex /bin/bash -c "rm -rf ~/MyReflexProject"
docker cp ./ reflex:/home/nix/MyReflexProject
docker exec -it reflex /bin/bash -c "sudo chown -R nix:nix MyReflexProject; sudo chmod -R 755 MyReflexProject; cd MyReflexProject; . ~/e.sh; nix-shell"
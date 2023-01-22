docker start reflex
docker exec reflex /bin/bash -c "sudo apt install -y ssh nano"
docker exec reflex /bin/bash -c "sudo service ssh start"
docker exec reflex /bin/bash -c "mkdir /home/nix/.ssh/"
docker cp ~/.ssh/id_ed25519.pub reflex:/home/nix/.ssh/authorized_keys
docker exec reflex /bin/bash -c "sudo chown nix:nix /home/nix/.ssh/authorized_keys"
docker exec reflex /bin/bash -c "sudo chmod 600 /home/nix/.ssh/authorized_keys"
# have fun with code!
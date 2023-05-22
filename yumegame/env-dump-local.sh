nix-shell --run "env > envfile"
python3 - << ENDPROGRAM
f = open('envfile')
r = f.read()
f.close()
f = open('envdenylist')
s = f.read().split("\n")
f.close()
t = "\n".join(list(filter(lambda x: not x.split("=")[0] in s, r.split("\n"))))
f = open('envfile', 'w')
f.write(t)
f.close()
ENDPROGRAM

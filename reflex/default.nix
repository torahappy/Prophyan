{
    system ? builtins.currentSystem,
    reflex-platform ? fetchGit {
        url = "https://github.com/reflex-frp/reflex-platform.git";
        rev = "12ab0adac1f3f1869e256e2f7fcd9f4ff1394d92";
    }
}:
(import reflex-platform {
    inherit system;
}).project ({ pkgs, ... }: {
  packages = {
    MyReflexProject = ./frontend;
  };

  shells = {
    ghcjs = ["frontend"];
  };
})
document.addEventListener("DOMContentLoaded", function () {
  let sp = new URLSearchParams(window.location.search);
  if (sp.get("hires") !== null) {
    Array.from(document.getElementsByTagName("img")).forEach(async (x) => {
      let [all, dir, file, ext] = x.src.match(/(.*\/)?(.*)\.(.*)/);
      console.log(file)
      let res = await (await fetch(dir + "orig")).text();
      
      let orig_file = Array.from(res.matchAll(/<li><a href="(.+?)"/g))
          .map((x) => x[1])
          .map((x) => x.match(new RegExp('/.*/((.*)\\.(.*))')))
	  .filter((x) => x !== null && x[2] == file)[0][1];
      console.log(orig_file);
      
      x.src = dir + "orig/" + orig_file;
    });
  }
  if (sp.get("big") !== null) {
    Array.from(document.getElementsByClassName("images")).concat(...Array.from(document.getElementsByClassName("images-large"))).forEach((x) => {
      x.className = "images-page-large"
    })
  }
});

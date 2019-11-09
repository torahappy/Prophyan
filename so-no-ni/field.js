// 秋梓緒む?

let akishi = {
  mkname: () => {
    return String(Math.random())
  },
  tukuruyo: (ctx, structors) => {
    for (let str of structors) {
      let args = str.slice(0, -1);
      let value = str[str.length - 1];
    }
  }
}

let CTX = {}

// tests???
CTX = tukuruyo(CTX, [])

CTX = tukuruyo(CTX, [[A -> B -> a:A -> OR A B], [A -> B -> b:B -> OR A B]])

or_1 = CTX[Object.keys(CTX)[0]]

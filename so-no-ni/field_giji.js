// 秋梓緒む?

let akishi = {
  tsukuri: (ctx, structors) => {
    let newctx = copy(ctx)
    add(newctx.inds, structors)
    return newctx
  },
  wakare: (ctx, obj) => {
    let newctx = copy(ctx)
    
  }
}








let CTX = {}

CTX = tsukuri(CTX, [[At -> Bt -> A -> OR At Bt, OR At Bt -> A], [At -> Bt -> B -> OR At Bt, OR At Bt -> B]])

or_1 = CTX[Object.keys(CTX)[0]]


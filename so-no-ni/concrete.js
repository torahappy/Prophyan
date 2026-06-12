let data_eq = function (x, y) {
    return JSON.stringify(x) === JSON.stringify(y)
}

let assert_data_eq = function(x, y, ...args) {
    assert(data_eq(x, y), ...args)
}

// TODO: avoid conflict
// TODO: make human readable names
let newname = function(ctx) {
    return(sha256(JSON.stringify(ctx)))
}

/**
 * Destruct arrow.
 * @param {*} ctx Base context.
 * @param {*} key_arrow The key of the arrow (v : p -> q)
 * @param {*} key_prop The key of the prop to be MPed (i.e. some object that have type p at level t)
 * @param {*} t The offset of the type time.
 */
let arrow_d = function (ctx, key_arrow, key_prop, t) {
    assert_data_eq(ctx[key_arrow][t].name, "arrow")
    let v = ctx[key_arrow][t].v
    let p = ctx[key_arrow][t].p
    let q = ctx[key_arrow][t].q
    assert_data_eq(ctx[key_prop][t], p)
    ctx[newname(ctx)] = [{}, ]
}


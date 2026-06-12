function copy(obj) { return JSON.parse(JSON.stringify(obj)) }

/**
 * AND constructor.
 * @param {*} ctx Base context
 * @param {*} obj1 Index of the input object
 * @param {*} obj2 Index of the input object
 * @param {*} str1 Index of the output object
 */
function construct_and(ctx, str1, str2, str3) {
    let newctx = copy(ctx)
    newctx[str3] = ["And", ["And", newctx[str1], newctx[str2]]]
    return newctx
}

/**
 * AND destructor.
 * @param {*} ctx Base context
 * @param {*} str1 Index of the input object
 * @param {*} str2 Index of the output object
 * @param {*} str3 Index of the output object
 */
function destruct_and(ctx, str1, str2, str3) {
    let newctx = copy(ctx)
    newctx[str2] = newctx[str1][1][1]
    newctx[str3] = newctx[str1][1][2]
    return newctx
}

/**
 * OR constructor.
 * @param {*} ctx 
 * @param {*} str1 
 * @param {*} obj1 
 * @param {*} str2 
 */
function construct_or_left(ctx, str1, obj1, str2) {
    let newctx = copy(ctx)
    newctx[str2] = ["Or", ["Left", newctx[str1], obj1]]
    return newctx
}

/**
 * OR constructor.
 * @param {*} ctx 
 * @param {*} obj1 
 * @param {*} str1 
 * @param {*} str2 
 */
function construct_or_right(ctx, obj1, str1, str2) {
    let newctx = copy(ctx)
    newctx[str2] = ["Or", ["Right", obj1, newctx[str1]]]
    return newctx
}

/**
 * OR destructor.
 * @param {*} ctx 
 * @param {*} obj1 
 * @param {*} str1 
 * @param {*} str2 
 */
function destruct_or(ctx, str1, str2) {
    let newctx_1 = copy(ctx)
    let newctx_2 = copy(ctx)
    newctx_1[str1] = newctx_1[str2][1][0]
    newctx_2[str1] = newctx_1[str2][1][1]
    return [newctx_1, newctx_2]
}
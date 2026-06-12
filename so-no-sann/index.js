function Prop (data) {
    this.data = data
}

function Or (left, right) {
    this.left = left
    this.right = right
}

function And (left, right) {
    this.left = left
    this.right = right
}

// make zero
function arr_z (x) {
    return new Prop([])
}

// make x -> x
function arr_e (x) {
    return new Prop([x, x])
}

// make x -> p, under the condition that p is Prop
function arr_r (x, p) {
    if (p instanceof Prop) {
        return new Prop([x, p.data])
    }
}

// make a or b, under the condition that a is Prop
function or_r (a, b) {
    if (a instanceof Prop) {
        return new Or(a.data, b)
    }
}

// make a or b, under the condition that b is Prop
function or_l (a, b) {
    if (b instanceof Prop) {
        return new Or(a, b.data)
    }
}

// convert Prop [(a or b), [a, ... , x], [b, ..., x]] to x
function or_s (p, ) {

}

function and_c () {

}

function and_r () {

}

function and_l () {

}
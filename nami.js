let Nami = function (n, m, k = 0.01) {
    this.state = new Float32Array(n * m);
    this.k = k;
}

Nami.prototype.step = function () {

}

Nami.prototype.getState = function () {

}

Nami.prototype.setK = function (k) {
    this.k = k;
}
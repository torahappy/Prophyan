let Util = {
    rotate: function (x, y, z, rx, ry, rz) {
        let [sin, cos] = [Math.sin, Math.cos];
        return [
            x*cos(ry)*cos(rz) - y*sin(rz)*cos(ry) + z*sin(ry),
            x*(sin(rx)*sin(ry)*cos(rz) + sin(rz)*cos(rx)) - y*(sin(rx)*sin(ry)*sin(rz) - cos(rx)*cos(rz)) - z*sin(rx)*cos(ry),
            x*(sin(rx)*sin(rz) - sin(ry)*cos(rx)*cos(rz)) + y*(sin(rx)*cos(rz) + sin(ry)*sin(rz)*cos(rx)) + z*cos(rx)*cos(ry)
        ]
    }
}
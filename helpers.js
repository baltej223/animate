
Object.prototype.draw = function (color) {
    anim.drawVector(this, color)
    return this;
}

Object.prototype.reverse = function () {
    return vector.reverse(this);;
}
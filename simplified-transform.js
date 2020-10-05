if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments
        return this.replace(/{(\d+)}/g, function(match, number) { 
            if (Array.isArray(args[0]) && args.length == 1) {
                return typeof args[0][number] != 'undefined'
                    ? args[0][number]
                    : match
            } else {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
            }
        })
    }
}

function getRGB(R, G, B) {
    return 'rgb({0}, {1}, {2})'.format(R, G, B)
}

function getRandomColor() {
    return new Color(Math.random(), Math.random(), Math.random())
}

function unitSimplification(unit) {
    if (unit.endsWith('px')) {
        return parseInt(unit.slice(0, -2))
    } if (unit.endsWith('deg')) {
        return parseInt(unit.slice(0, -3))
    } else {
        return unit
    }
}

function unitRefinement(unit, specifiedType = 'px') {
    if (!isNaN(parseFloat(unit)) && specifiedType == 'px') {
        return unit + 'px'
    } else if (!isNaN(parseFloat(unit)) && specifiedType == 'deg') {
        return unit + 'deg'
    } else if (!isNaN(parseFloat(unit)) && unit.endsWith('rad') && specifiedType == 'deg') {
        const radsToDegs = rad => rad * 180 / Math.PI
        return radsToDegs(parseFloat(unit.slice(0, -3))) + 'deg'
    } else {
        return unit
    }
}

function angleMultiply(angle, num) {
    console.log(angle)
    if (typeof angle == 'number') {
        return angle * num
    } else if (angle.endsWith('deg') || angle.endsWith('rad')) {
        return parseFloat(angle.slice(0, -3)) * num + (angle.endsWith('deg') ? 'deg' : 'rad')
    } else if (angle.endsWith('grad') || angle.endsWith('turn')) {
        return parseFloat(angle.slice(0, -4)) * num + (angle.endsWith('grad') ? 'grad' : 'turn')
    }
}

class Transform {
    constructor() {
        this.translate3D = [0, 0, 0]
        this.scale = [1, 1]
        this.rotate3D = [0, 0, 0]
    }
    
    setTranslate(x, y) {
        this.translate3D[0] = x
        this.translate3D[1] = y
    }
    
    setTranslate3D(x, y, z) {
        this.translate3D[0] = x
        this.translate3D[1] = y
        this.translate3D[2] = z
    }
    
    setTranslateX(x) { this.translate3D[0] = x }
    setTranslateY(y) { this.translate3D[1] = x }
    setTranslateZ(z) { this.translate3D[2] = x }
    
    setScale(x, y = null) {
        this.scale[0] = x
        if (y != null) { this.scale[1] = y }
    }
    
    setScaleX(x) { this.scale[0] = x }
    setScaleY(y) { this.scale[1] = y }
    
    setRotate(angle) {
        this.rotate3D[2] = angle
    }
    
    setRotate3D(x, y, z) {
        this.rotate3D[0] = x
        this.rotate3D[1] = y
        this.rotate3D[2] = z
    }
    
    setRotateX(x) { this.rotate3D[0] = x }
    setRotateY(y) { this.rotate3D[1] = y }
    setRotateZ(z) { this.rotate3D[2] = z }
    
    getParsed() {
        var transformString = 'translate3d({0}, {1}, {2})'.format(unitRefinement(this.translate3D[0], 'px'), unitRefinement(this.translate3D[1], 'px'), unitRefinement(this.translate3D[2], 'px'))
        var scaleString = 'scale({0}, {1})'.format(this.scale)
        var rotateString = 'rotate3d({0}, {1}, {2}, {3}deg)'.format(unitRefinement(this.rotate3D[0], 'deg').slice(0, -3), unitRefinement(this.rotate3D[1], 'deg').slice(0, -3), unitRefinement(this.rotate3D[2], 'deg').slice(0, -3), Math.max(...[parseFloat(unitRefinement(this.rotate3D[0], 'deg').slice(0, -3)), parseFloat(unitRefinement(this.rotate3D[1], 'deg').slice(0, -3)), parseFloat(unitRefinement(this.rotate3D[2], 'deg').slice(0, -3))]))
        return '{0} {1} {2}'.format(transformString, scaleString, rotateString)
    }
}

if (!Element.prototype.transform) {
    Element.prototype.transform = null
    Element.prototype.setTransform = function (transform) {
        this.transform = transform
        this.style.transform = this.transform.getParsed()
    }
    Element.prototype.updateTransform = function () {
        this.style.transform = this.transform.getParsed()
    }
}
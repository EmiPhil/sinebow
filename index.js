const RANGE_MIN = 0
const RANGE_MAX = 255

function RGB(R=255, G=255, B=255) {
  [R,G,B].forEach(function (int, idx) {
    if (!Number.isSafeInteger(int)) throw new TypeError('unsafe integer at position ' + idx.toString(10))
    if (int < RANGE_MIN || int > RANGE_MAX) throw new TypeError('integer out of bounds at position ' + idx.toString(10))
  })

  this.R = R
  this.G = G
  this.B = B
}

RGB.prototype.toArray = function () {
  return [this.R, this.G, this.B]
}

RGB.prototype.toHexString = function () {
  const rgb = this.toArray()
  let hex = ''
  for (let i = 0; i < 3; i++) {
    hex += rgb[i].toString(16)
  }
  return hex
}

function Hex (hex = '#000000') {
  if (hex[0] === '#') hex = hex.slice(1)
  if (hex.length !== 6) throw new TypeError('invalid hex length != 6')
  if (Number.isNaN(Number.parseInt(hex, 16))) throw new TypeError('invalid hex string')
  this.hex = hex
}

Hex.prototype.toString = function () {
  return '#' + this.hex
}

Hex.prototype.toRGB = function () {
  const rgb = []
  for (let i = 0; i < 6; i+=2) {
    const int = Number.parseInt(this.hex.slice(i, i+2), 16)
    if (Number.isNaN(int)) throw new TypeError('invalid hex at position ' + i.toString(10))
    rgb.push(int)
  }
  return new RGB(...rgb)
}

function Color(colorString) {
  try {
    if (Array.isArray(colorString)) {
      colorString = new RGB(...colorString)
    } else {
      colorString = new Hex(colorString).toRGB()
    }
  } catch (typeError) {
    // by parsing the colors in the constructors we can fail early here
    throw new TypeError('invalid color argument: ' + typeError.toString())
  }

  this.RGB = colorString
}

Object.defineProperty(Color, 'hex', { get: function () { return this.RGB.toHexString() } })
Object.defineProperty(Color, 'rgb', { get: function () { return this.RGB.toArray() } })

Color.prototype.add = function (color = new Color()) {
  return new Color(this.rgb.map(function (value, idx) {
    value = value + color.rgb[idx]
    return value > RANGE_MAX ? RANGE_MAX : value
  }))
}

Color.prototype.sub = function (color = new Color()) {
  return new Color(this.rgb.map(function (value, idx) {
    value = value - color.rgb[idx]
    return value < RANGE_MIN ? RANGE_MIN : value
  }))
}

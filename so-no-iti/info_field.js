"ものいだる よのうきをこそ かきこめば ブロックチェーンの ねぞきこえたる (てきとー)"
"このうたはものいだる情報空間によのうきことつれづれなるままにかきこめば情報のゆきつもりてぱーまねんとなれども人いとやすくわするなるブロックチェーンのここちなどいとあはれにきこえられけるをよむものなり (てきとー)"

// Exposure to outer world
let pushInfo;
let getInfo;
let getFieldSize;

{
  let field = []

  /**
   * Push an information to the information field.
   */
  pushInfo = function (info) {
    field.push(info)
  }

  /**
   * Get an information from the information field.
   */
  getInfo = function (i) {
    return field[i]
  }

  /**
   * Get the length of the field.
   */
  getFieldSize = function (i) {
    return field.length
  }
}

export {pushInfo, getInfo, getFieldSize}
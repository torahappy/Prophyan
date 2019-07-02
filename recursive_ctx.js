"情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。........"

// Exposure to updateFuncs / getFieldValue
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

// Exposure to outer world
let getFieldValue;
let updateFuncs;

{
  let s = JSON.stringify()
  let p = JSON.parse()

  let tsuchiUtil = {
    
  }

  updateFuncs = {
    privilege: {
      admin: () => {

      }
    },
    tsuchi: {
      get: () => {

      }
    }
  }

  getFieldValue = function (c) {
    return field[c]
  }
}

export {getFieldValue, updateFuncs}
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
  let push = (x) => {pushInfo(JSON.stringify(x)); return getFieldSize() - 1;}
  let get = (x) => (JSON.parse(getInfo(x)))

  let privilegeUtil = {
    createPrivilege: (rank) => {
      return {type: "privilege", rank}
    },
    checkPrivilege: (ticket, action) => {
      if (ticket.rank === "admin") {
        return true;
      }
      return false;
    }
  }

  updateFuncs = {
    privilege: {
      admin: () => {
        return push(createPrivilege("admin"))
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
"情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。........"

import {pushInfo, getInfo, getFieldSize} from "./info_field.js"

// Exposure to outer world
let getFieldValue;
let updateFuncs;

{
  let iden = (x) => (x)
  let state = () => (JSON.parse(getInfo(getFieldSize() - 1)))
  let push = (x, morph=iden) => {
    let s = state();
    pushInfo(JSON.stringify(x))
    pushInfo(morph(s));
    return getFieldSize() - 1;
  }

  let pushmany = (xs, morph=iden) => {
    let s = state();
    xs.map((x)=>(pushInfo(JSON.stringify(x))));
    pushInfo(morph(s));
    return getFieldSize() - 1;
  }

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
      get: (ticket_id, pos) => {
        let s = state();
        if (checkPrivilege(get(ticket_id), "tsuchi_get")) {
            return push({type: "tsuchi_record", value: s.tsuchi[pos]})
        }
        return push({type: "error_privilege"})
      }
    }
  }

  getFieldValue = function (c) {
    return field[c]
  }
}

export {getFieldValue, updateFuncs}

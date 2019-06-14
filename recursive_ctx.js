"情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。情報を使う。それによって情報を得る。........"

let pushInfo;
let getInfo;

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
     * Get the length of the field for metadata purpose.
     */
    getFieldSize = function (i) {
      return field.length
    }
}

let accessFieldValue;

{
    let funcs = {
      hello_world: () => (field.push("my first ctx")),
      hello_world_2: (c) => {if (field[c] == "my first ctx") { return field.push("my second ctx") }}
    }

    accessFieldValue = function (c) {
      return field[c]
    }
}
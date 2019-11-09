import {registerAtom, registerConjunction, validateSentence} from "./hyouron.js"

function assert_true(x) {
    if (x !== true) {
        throw "assert_true failed"
    }
}

function assert_false(x) {
    if (x !== false) {
        throw "assert_false failed"
    }
}

registerAtom("あとあと")

registerAtom("むむむ")

registerConjunction("こんこん", 3)

registerConjunction("じゅじゅじゅ", 2)

assert_true(validateSentence(["あとあと"]))

assert_true(validateSentence(["むむむ"]))

assert_false(validateSentence(["むむむ", ["あとあと"]]))

assert_true(validateSentence(["こんこん", ["あとあと"], ["あとあと"], ["あとあと"]]))

assert_true(validateSentence(["こんこん", ["こんこん", ["あとあと"], ["あとあと"], ["あとあと"]], ["あとあと"], ["あとあと"]]))

assert_true(validateSentence(["じゅじゅじゅ", ["こんこん", ["あとあと"], ["あとあと"], ["あとあと"]], ["こんこん", ["あとあと"], ["あとあと"], ["あとあと"]]]))

console.log("test_hyouron passed")
"情報同士の関わり合いには一定のパターンがある。例えば、「Aという情報はBという媒体によって強化される。そのことはCという事実に体現される。」といったように。この文章内ではA B Cはそれぞれ型のようなものを持っている。Cが具体的 Bの形容詞的 Aが何かしら強度をもつ情報であること。などである。評論は「事実=>>考察」「事実=>>考察」「事実=>>考察」「事実=>>考察」「事実=>>考察」「事実=>>考察」「事実=>>考察」「事実=>>考察」「事実=>>考察」 ... というのが普通だけど、それは本質ではない。評論というものが表現する、情報同士の関係性のダイアグラム、およびそこから示唆される世界全体の情報の流れというものが本質なのである。これは言い換えると、個々の具体的な言説から離れ、抽象的な構造を考える、SF的にみるということである。"

let Combinators = {}

/**
 * Get copied hashmap of Combinators.
 */
let getCombinators = function () {
    return JSON.parse(JSON.stringify(Combinators));
}

/**
 * Register an atom.
 */
let registerAtom = function (name) {
    Combinators[name] = JSON.stringify({type: "atom"})
}

/**
 * Register a conjunction.
 */
let registerConjunction = function (name, num_args) {
    Combinators[name] = JSON.stringify({type: "conj", num_args})
}

/**
 * Validate a sentence.
 * @param {Array} sentence
 */
let validateSentence = function (sentence) {
    let name = sentence[0]
    let params = JSON.parse(Combinators[name])
    if (params.type === "atom" && sentence.length === 1) {
        return true
    }
    if (params.type === "conj" && sentence.length === params.num_args + 1) {
        return sentence.slice(1).reduce((a, b) => (a && validateSentence(b)), true)
    }
    return false
}

export {getCombinators, registerAtom, registerConjunction, validateSentence}

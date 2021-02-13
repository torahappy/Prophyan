class EventManagement {
    constructor () {
        this.eventNameToFuncs = {}
    }
    tableCheck (eventName) {
        if (this.eventNameToFuncs[eventName] === undefined) {
            this.eventNameToFuncs[eventName] = []
        }
    }
    runEvent (eventName, arg) {
        this.tableCheck(eventName)
        for (let func of this.eventNameToFuncs[eventName]) {
            func(arg)
        }
    }
    addListener (eventName, func) {
        this.tableCheck(eventName)
        this.eventNameToFuncs[eventName].push(func)
    }
}
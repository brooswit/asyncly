module.exports = exports = async (func) => {
    return func.then ? await func() : new Promise((done) => { func(done) })
}
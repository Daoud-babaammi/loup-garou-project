exports.logMiddelware = (req, res, next) => {
    console.log(`[${req.method}]: ${req.originalUrl}`);
    console.log(`params: ${JSON.stringify(req.params)}`)
    next()
}
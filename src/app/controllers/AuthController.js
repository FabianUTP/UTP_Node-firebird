const AuthController = {}

AuthController.login = (req, res) => {
    res.render('auth')
}

module.exports = {
    AuthController
}
const { request, response } = require("express");

const verifySesion = (req = request, res = response, next) => {
    if(req.session.name) {
        next()
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    verifySesion
}
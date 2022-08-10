const { request, response } = require("express");

const verifySesion = (req = request, res = response, next) => {
    if(req.session.userAuth) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    verifySesion
}
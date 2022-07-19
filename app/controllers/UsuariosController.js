const { request, response } = require("express");

const show = (req = request, res = response) => {
    res.render('home');
}

module.exports = {
    show
}
const { request, response } = require("express");

const show = async (req = request, res = response) => {
    
    res.render('home');
}

module.exports = {
    show
}
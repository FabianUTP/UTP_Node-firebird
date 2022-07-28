const { request, response } = require("express");
const { dash_items } = require("../../utils/dahsboard-items");

const HomeController = {};

HomeController.show = (req = request, res = response) => {

    res.render('dashboard', {
        alumnoName: req.session.name,
        items: dash_items
    });
}

module.exports = {
    HomeController
}
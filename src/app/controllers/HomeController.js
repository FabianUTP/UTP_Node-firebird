const { request, response } = require("express");
const { dash_items } = require("../../utils/dahsboard-items");

const HomeController = {};

HomeController.show = (req = request, res = response) => {

    res.render('alumno/dashboard', {
        items: dash_items,
    });
}

module.exports = {
    HomeController
}
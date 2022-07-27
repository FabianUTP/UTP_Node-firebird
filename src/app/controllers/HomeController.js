const { request, response } = require("express");
const { dash_items } = require("../../utils/dahsboard-items");

const HomeController = {};

HomeController.show = (req = request, res = response) => {

    let alumnoName = 'Fabian Caamal';

    res.render('dashboard', {
        alumnoName,
        items: dash_items
    });
}

module.exports = {
    HomeController
}
const { request, response } = require("express");

const show = (req = request, res = response) => {
    res.json({
        ok: 200
    })
}

module.exports = {
    show
}
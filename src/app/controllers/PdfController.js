const firebird = require("node-firebird");
const options = require("../../configs/credential-firebird")
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const { request, response } = require("express");
const { Alumno } = require("../models/");

const PDFController = {};

PDFController.showById = async(req = request, res = response) => {
    const alumno = await Alumno.findById(req.session.IDAuth);
    let image = "data:image/jpeg;base64, ";

    firebird.attach(options, (err, db) => {
        if (err) throw err;

        db.query(
            `SELECT a.fotografia, n.acuerdo || ' en ' || n.descripcion AS carrera
            FROM alumnos a
            JOIN cfgniveles n ON a.nivel = n.nivel
            WHERE a.matricula = '${alumno?.MATRICULA}'`,
            (err, row) => {
                if (err) throw err;

                let foto = row[0] ? row[0].FOTOGRAFIA : null;
                let carrera = row[0] ? row[0].CARRERA : null;

                if (foto) {
                    foto((err, _name, e) => {
                        if (err) throw err;

                        let chunks = [];
                        e.on("data", (chunk) => {
                            chunks.push(chunk);
                        });

                        e.on("end", () => {
                            let buffer = Buffer.concat(chunks);
                            image += buffer.toString("base64");

                            let newAlumno = {
                                ...alumno,
                                image,
                                carrera,
                                matricula: alumno.MATRICULA,
                                nombre: alumno.NOMBRE,
                                apellidoPaterno: alumno.PATERNO,
                                apellidoMaterno: alumno.MATERNO,
                                cuatrimestre: alumno.GRADO,
                            };

                            db.detach();
                            res.render("alumno/boletas/boletasAlumno.hbs", newAlumno);
                        });
                    });
                }
            }
        );
    });
};

PDFController.getBoletas = async(req = request, res = response) => {

    const alumno = await Alumno.findById(req.session.IDAuth);

    res.render("alumno/boletas/boletasAlumno.hbs", alumno);
};

module.exports = PDFController;
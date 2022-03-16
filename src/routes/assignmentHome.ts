import express from "express";
const assignmentHome = express.Router();
const Student = require('../models/Students');
import studentMembers from './studentMembers';
const mongoose = require("mongoose");
let currentPerson = studentMembers.person;

assignmentHome.get('/', (req, res) => {
    res.render('assignmentHome')
});


// 

















export default assignmentHome;
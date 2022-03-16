import express from "express";
const addAssignment = express.Router();
const Student = require('../models/Students');
import studentMembers from './studentMembers';
const mongoose = require("mongoose");
import assignmentHome from "./assignmentHome";


let access;
let currentStudent: any;
let studentName:any;
let studentEmail:any;
let myAverageScore: string | number;
let array:any;
let totalScores = 0;
let totalPossible = 0;
myAverageScore = 0;
let emptyArray = [];
function myAverageScore1 (array:any) {
    for (let i = 0; i < array.length; i++) {
        console.log("total score:" + totalScores);
        console.log("total possible:" + totalPossible);
        if (array[i].completed === "true") {
            totalScores = totalScores + parseInt(array[i].score);
            totalPossible = totalPossible + array[i].total;
        }
    } 
    myAverageScore  = parseFloat(((totalScores / totalPossible) * 100).toFixed(1));
    return myAverageScore;
};



addAssignment.get('/add-assignment', (req, res) => {
    res.render('addAssignment')
})

addAssignment.post('/add-assignment', (req, res) => {
    access = req.body.email;
    let confirmedStudent = Student.findOne({email: access});
    console.log("from home: " + confirmedStudent);
    confirmedStudent.then((student: typeof Student) => {
        studentEmail = student.email
        studentName = student.name;
        currentStudent = student;
        console.log("from addAss: " + student);
        if (student) {
            console.log(student);
            const newAssignment = {
                id: student.assignments.length + 1,
                assignment: req.body.assignment,
                score: req.body.score,
                total: req.body.total,
                completed: req.body.completed,
            };
            console.log(newAssignment);
            
            Student.findByIdAndUpdate(
                student._id,
                {$push: {"assignments": newAssignment}},
                {safe: true, upsert: true, new: true},
                function(err: any, model: any) {
                    console.log("errorMsg: " + err);
                }
            );
            res.redirect('assignment-home')
        } else {
            console.log("DDDD");
            console.log(student);
        }
    })
})

assignmentHome.get('/assignment-home', (req, res) => {
    console.log(currentStudent);
    if (currentStudent == undefined) {
        console.log("no assignments");
        res.render('assignmentHome', {
            studentName: studentName,
            arrayOfAssignments: array,
            myAverageScore: myAverageScore
        })
    } 
    else {
        console.log("found assignments");  
    }
        if (currentStudent) {
            console.log(currentStudent);
            array = currentStudent.assignments;
            myAverageScore1(array);
            res.render('assignmentHome', {
                studentName: studentName,
                arrayOfAssignments: array,
                myAverageScore: myAverageScore + "%"
            })
        } 
        else {
            console.log("on track");
        }
})

assignmentHome.get('/delete/:id', (req:any, res:any) => {
    console.log(req.params.id);
    const id = parseInt(req.params.id);
    let confirmedStudent = Student.findOne({email: studentEmail});
    confirmedStudent
    .then((student: typeof Student) => {
        console.log("student assignment array count: " + student.assignments.length);
        let assign;
        for (let i=0; i < student.assignments.length; i++) {
            if(student.assignments[i].id == id) {
                assign = student.assignments[i];
                assign.remove();
                return student.save()
                .then(() => {
                    res.render('assignmentHome', {
                        studentName: student.name,
                        arrayOfAssignments: student.assignments,
                        myAverageScore: myAverageScore1(student.assignments) + "%"
                    })
                })
            }
        }
    });
});

assignmentHome.get('/delete-con/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let confirmedStudent = Student.findOne({email: studentEmail});
    confirmedStudent
    .then((student: typeof Student) => {
        let assign = "";
        for (let i=0; i < student.assignments.length; i++) {
            if(student.assignments[i].id == id) {
                assign = student.assignments[i].assignment
            }
        }
        res.render('deleteAssignmentCon', {
            assignment:assign,
            id:id
        });  
    });
})

assignmentHome.get('/edit-con/:id', (req,res) => {
    const id = parseInt(req.params.id);
    let confirmedStudent = Student.findOne({email: studentEmail});
    confirmedStudent
    .then((student: typeof Student) => {
        let targetAssignment;
        for (let i=0; i < student.assignments.length; i++) {
            if(student.assignments[i].id == id) {
                targetAssignment = student.assignments[i];
            }
        }
        res.render('editAssignmentCon', {
            id: id,
            assignment:targetAssignment.assignment,
            score:targetAssignment.score,
            total:targetAssignment.total,
            completed:targetAssignment.completed
        })
    })
})

assignmentHome.post('/edit/:id', (req, res) => {
    console.log("in the edit post");
    console.log(req.params.id);
    const id = parseInt(req.params.id);
    console.log(id);
    
    let confirmedStudent = Student.findOne({email: studentEmail});
    confirmedStudent
    .then((student: typeof Student) => {
        console.log("in the 1st then");
        for (let i=0; i < student.assignments.length; i++) {
            console.log(student.assignments[i].id);
            console.log(id);
            if (student.assignments[i].id == id) {
                let targetAssignment = student.assignments[i];
                targetAssignment.assignment = req.body.assignment;
                targetAssignment.score = req.body.score;
                targetAssignment.total = req.body.total;
                targetAssignment.completed = req.body.completed;
                return student.save()
                .then(() => {
                    console.log("in the 2nd then");
                    res.render('editAssignment', {
                        id: id,
                        assignment: req.body.assignment,
                        score: req.body.score,
                        total: req.body.total,
                        completed: req.body.completed
                    })    
                })
            }
        }
    })
})













export default addAssignment;
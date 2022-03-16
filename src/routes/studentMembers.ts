const express = require('express');
const studentMembers = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const Student = require('../models/Students');
const { forwardAuthenticated, ensureAuthenticated } = require('../Config/student-authenticate');
let currentStudentEmail;
let currentStudent;

// Endpoint
// dbusers.get('/', forwardAuthenticated, (req:any, res:any) => res.render('login'));

// Login Pages(2nd for authentication rejection)
// dbusers.get('/login', forwardAuthenticated, (req:any, res:any) => res.render('dblogin'));
studentMembers.get('/student-login', (req:any, res:any) => res.render('studentLogin'));
studentMembers.get('/student-login2', (req:any, res:any) => res.render('studentLogin2'));

// Register Page
studentMembers.get('/student-register', (req:any, res:any) => res.render('studentRegister'));

// Register User
studentMembers.post('/student-register', (req:any, res:any) => {
  const { name, email, password, password2 } = req.body;
  let errors:any = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('student-register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    Student.findOne({ email: email })
    .then((user: any) => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('student-register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newStudent = new Student({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err: any, salt: any) => {
          bcrypt.hash(newStudent.password, salt, (err: any, hash: any) => {
            if (err) throw err;
            newStudent.password = hash;
            newStudent
              .save()
              .then((user: any) => {
                console.log("User Registerd");
                console.log(user);
                console.log(user.name);
                console.log(user.password);
                
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/student-login');
              })
              .catch((err: any) => console.log(err));
          });
        });
      }
    });
  }
});

// Login
// studentMembers.post('/student-login', (req:any, res:any, next:any) => {
//   console.log("attempting to login1");
//   passport.authenticate('local', {
//     successRedirect: '/dbdashboard',
//     failureRedirect: '/dblogin',
//     failureFlash: true
//   })(req, res, next);
// });

studentMembers.post('/student-login', (req:any, res:any, next:any) => {
  console.log("attempting to login2");
  console.log(req.body);
  console.log(req.body.email);
  console.log(req.body.password);
    currentStudent = req.body.name;
    currentStudentEmail = req.body.email;
    let person = Student.findOne({ email: currentStudentEmail })
    console.log(person);
    console.log(currentStudent);
    
  passport.authenticate('local', {
    successRedirect: '/assignment-home',
    failureRedirect: '/student-login',
    failureFlash: true
  })(req, res, next);
});

// Logout
studentMembers.get('/student-logout', (req:any, res:any) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/student-login');
});


export default studentMembers;
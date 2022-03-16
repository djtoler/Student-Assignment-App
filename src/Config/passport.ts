const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
import mongoose from 'mongoose';
const Student = require('../models/Students');


module.exports = function(passport:any) {
    passport.use(
      new LocalStrategy({ usernameField: 'email' }, (email:string, password:string, done:any) => {
        // Match user
        Student.findOne({
          email: email
        }).then((student: { password: any; }) => {
          if (!student) {
            console.log("email didnt match");
            return done(null, false, { message: 'That email is not registered' });
          }
  
          // Match password
          bcrypt.compare(password, student.password, (err:string, isMatch:any) => {
            console.log("email matched, searching for password match ");
            if (err) throw err;
            if (isMatch) {
              console.log("passwords matched");
              return done(null, student);
            } else {
              console.log("wrong password");
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        });
      })
    );
  
    passport.serializeUser(function(student:any, done:any) {
      console.log("serialized user");
      
      done(null, student.id);
    });
  
    passport.deserializeUser(function(id:string, done:any) {
      console.log("deserialized user");
      Student.findById(id, function(err:string, student:any) {
        done(err, student);
      });
    });
  };
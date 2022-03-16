const mongoose = require('mongoose');


const StudentSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    chatLogs: 
    [
      {
        _id: false,
        msg: {type: String},
        date: {type: Date, default: Date.now}    
      }
    ],
    assignments:
    [
        {
            id: Number,
            assignment: String,
            score: Number,
            total: Number,
            completed: String,
            date: {type: Date, default: Date.now}
        }
    ]
  });


const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
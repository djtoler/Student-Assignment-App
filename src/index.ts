import express from 'express';
const http = require('http');
const socketio = require('socket.io');
import cors from 'cors';
import path from "path";
import "dotenv/config";
const mongoose = require("mongoose");
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport');
const moment = require('moment');
const Student = require('./models/Students');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

import addAssignment from './routes/addAssignment';
import addAssignmentCon from './routes/addAssignmentCon';
import assignmentHome from './routes/assignmentHome';
import deleteAssignment from './routes/deleteAssignment';
import deleteAssignmentCon from './routes/deleteAssignmentCon';
import editAssignment from './routes/editAssignment';
import editAssignmentCon from './routes/editAssignmentCon';
import studentMember from './routes/studentMembers';
import studentChat from './routes/studentChat';


const app = express();
const server = http.createServer(app);
export const io = socketio(server);
require('./Config/passport')(passport);

const connection = mongoose
  .connect('mongodb+srv://djtoler:alphagpc@cluster0.rwafh.mongodb.net/Students?retryWrites=true&w=majority', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(`Database connected successfully`))
  .catch((err: any) => console.log(err));

app.use(express.static(path.join(__dirname, "/Public")));
app.set("views", path.join(__dirname, "Views"));
app.set("partials", path.join(__dirname, "Views/Partials"));
app.set("view engine", "hbs");

const botName = "ChatCordBot";

io.on('connection', (socket:any) => {
    socket.on('joinRoom', ( {username, room, email, password}: {username:string, room:string, email:string, password:string, msg: string} ) => {
      let confirmedUser = Student.findOne({email: username})
      confirmedUser.then((user: typeof Student) => {
        if (user) {
          console.log(user);
          // create a variable for a chat user
          // userJoin is a function that creates a id, username & room for a user. Then
          // pushes it into the empty users array and returns user.
          const chatUser = userJoin(socket.id, username, room);
          // join user to whatever room they pick based on qs query string params
          socket.join(chatUser.room);
          socket.emit('message', formatMessage(botName, "Welcome To Food Chat"));
  
          // emmit to specific room that a new user has joined
          socket.broadcast
          .to(chatUser.room)
          .emit('message', formatMessage(botName, `${chatUser.username} has joined the chat!`));
  
          io.to(chatUser.room).emit('roomUsers', {
              room: chatUser.room,
              users: getRoomUsers(chatUser.room)
          });
          socket.on('chatMessage',  ( msg: string ) => {
            const chatUser = getCurrentUser(socket.id);
            console.log(socket.id);
            console.log(chatUser);
            console.log(msg);
  
            Student.findByIdAndUpdate(
              user._id,
              {$push: {"chatLogs": {msg: msg}}},
              {safe: true, upsert: true, new: true},
              function(err: any, model: any) {
                  console.log(err);
              }
          );
            let container = user.chatLogs;
            console.log("current user: " + user);
            console.log("current messages " + container.message);
          io
          .to(chatUser.room)
          .emit('message', formatMessage(chatUser.username, msg));
        });
        } else { 
          const newUser = new Student({
            name:username,
            email,
            password
          })
        }
      })  
    });
    console.log('new websocket connection');
  
    // listen for chat message
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', 
                formatMessage(botName, `${user.username} has left the chat!`)
            );
  
            io.to(user.room).emit('roomUsers', 
            {
                room: user.room, 
                users: getRoomUsers(user.room)
            }
            );
        };
    });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'dj',
    saveUninitialized: true,
    resave: true
})); 

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req:any, res:any, next:any) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use("/", addAssignment);
app.use("/", addAssignmentCon);
app.use("/", assignmentHome);
app.use("/", deleteAssignment);
app.use("/", deleteAssignmentCon);
app.use("/", editAssignment);
app.use("/", editAssignmentCon);
app.use("/", studentMember);

app.use("/", studentChat);

const port = 9090;
server.listen(port, () => {
    console.log("Listening On PORT: " + port);
});


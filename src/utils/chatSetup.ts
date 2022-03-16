import {io} from "../index";

export const chatFunc = () => {
    const formatMessage = require('./utils/messages');
    const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
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
}



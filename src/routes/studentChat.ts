import express from 'express';
const studentChat = express.Router();
import {chatFunc} from '../utils/chatSetup';

studentChat.get('/student-chat', (req, res) => {
    res.render('chatHome')
});

studentChat.get('/chatPage.hbs', (req, res) => {
    let username = req.query.username as string;
    let room = req.query.room as string;
    let msg = req.body.msg as string;
    chatFunc();
    res.render('chatPage', {
        username:username,
        room:room,
        msg:msg
    });
});

export default studentChat;
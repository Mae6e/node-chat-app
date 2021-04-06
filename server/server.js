const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage,generateLocationMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation');

var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket)=>{
    console.log('new user connection!');

    socket.on('join', (params,callback)=>{
      if(!isRealString(params.name) || !isRealString(params.room)){
        callback('نام خود و اتاق مورد نظر را وارد کنید!');
      }
      
      socket.join(params.room);
      socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app!'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} joined!`));
      callback();

    })

    socket.on('createMessage',(message , callback)=>{
      console.log('createMessage:', message);
      io.emit('newMessage', generateMessage(message.from,message.text));
      callback();
    })

    socket.on('createLocationMessage',(coords)=>{
      io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
    })
    socket.on('disconnect',()=>{
      console.log('user was disconnected!');
    })
})

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

server.listen(port,()=>{
    console.log(`server is up on ${port}`)
})
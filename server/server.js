const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage,generateLocationMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation');
const {Users} = require('./utils/user');
var users = new Users();

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
      users.removeUser(socket.id);
      users.addUser(socket.id , params.name, params.room);
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app!'));
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} joined!`));
      callback();

    })

    socket.on('createMessage',(message , callback)=>{
      var user = users.getUser(socket.id);
      if(user && isRealString(message.text)){
        io.to(user.room).emit('newMessage', generateMessage(user.name,message.text));
      }
      callback();
    })

    socket.on('createLocationMessage',(coords)=>{
      var user = users.getUser(socket.id);
      if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,coords.latitude,coords.longitude));
      }
    })
    socket.on('disconnect',()=>{
      var user = users.removeUser(socket.id);
      if(user){
         io.to(user.room).emit('updateUserList', users.getUserList(user.room));  
         io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has leave!`));       
      }
      console.log('user was disconnected!');
    })
})

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

server.listen(port,()=>{
    console.log(`server is up on ${port}`)
})
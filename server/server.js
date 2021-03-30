const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket)=>{
    console.log('new user connection!');

    socket.on('disconnect',()=>{
      console.log('user was disconnected!');
    })
})

const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

server.listen(port,()=>{
    console.log(`server is up on ${port}`)
})
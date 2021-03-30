const path = require('path');
const publicPath = path.join(__dirname,'../public');
const express = require('express');
var app = new express();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.listen(port,()=>{
    console.log(`server is up on ${port}`)
})
var socket = io();
socket.on('connect',function(){
    console.log('connected to server!');

    // socket.emit('createMessage',{
    //     from:'info@gmail.com',
    //     text:'hello'
    // })
})
socket.on('disconnect', function(){
    console.log('disconnect from server!');
})

socket.on('newMessage', function(message){
    console.log('new messgae',message);

    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
})

$('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from:'User',
        text:$('[name=message]').val()
    })
})
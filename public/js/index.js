var socket = io();
socket.on('connect',function(){
    console.log('connected to server!');
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
    var message = $('[name=message]');
    socket.emit('createMessage',{
        from:'User',
        text: message.val()
    },function(){
        message.val('')
    })
})

$('#send-location').on('click', function(){
    if(!navigator.geolocation){
        return alert('geolocation not supporter by your browser!')
    }
    $('#send-location').attr('disabled','disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        })
        $('#send-location').removeAttr('disabled').text('Send Location');
        return console.log(position);
    }, function(e){
        $('#send-location').removeAttr('disabled').text('Send Location');
        alert('unable to fetch location!')
    });
})

socket.on('newLocationMessage', function(message){
    var li = $('<li></li>');
    var a = $('<a target="_blank">my current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a)
    $('#messages').append(li);
})
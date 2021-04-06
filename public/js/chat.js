
var socket = io();

socket.on('connect',function(){
    console.log('connected to server!');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href ="/";
        }
        else{
            console.log('no error');
        }
    })
})

socket.on('disconnect', function(){
    console.log('disconnect from server!');
})

function scrollFunction(){
    var messages = $("#messages");
    var newMessage = messages.children('li:last-child');
  
    //Heights
    var scrollHeight = messages.prop('scrollHeight');
    var scrollTop = messages.prop('scrollTop');
    var clientHeight = messages.prop('clientHeight');
  
    var newMessageHeight = newMessage.innerHeight();
    var prevMessageHeight = newMessage.prev().innerHeight();
  
    if(newMessageHeight+prevMessageHeight+scrollTop+clientHeight >= scrollHeight){
       messages.scrollTop(scrollHeight);
    }
}

socket.on('newMessage', function(message){
    var template = $('#message-template').html();
    var formatedDate = moment(message.createdAt).format('hh:mm a');

    var html = Mustache.render(template,{
        text:message.text,
        from:message.from,
        createdAt:formatedDate
    });

    $('#messages').append(html);
    scrollFunction();
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
    var formatedDate = moment(message.createdAt).format('hh:mm a');
    var template = $('#location-message-template').html();
    var formatedDate = moment(message.createdAt).format('hh:mm a');

    var html = Mustache.render(template,{
        url:message.url,
        from:message.from,
        createdAt:formatedDate
    });
    $('#messages').append(html);
    scrollFunction();
})
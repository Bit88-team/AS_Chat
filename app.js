// app.js (서버)

const express = require('express'); 
const app = express(); 
const http = require('http'); 
const server = http.createServer(app); 
const fs = require('fs');   // File System(node 기본내장모듈)
const io = require('socket.io')(server);

app.use(express.static('src'));

app.get('/', function(req,res) {
    fs.readFile('./src/index.html', (err,data) => {
        if(err) throw err;
    
        res.writeHead(200, {
            'Content-Type' : 'text/html'
        })
        .write(data)
        .end();
    });
});

io.sockets.on('connection', function(socket){
    socket.on('newUserConnect', function(name){
        socket.name = name;

        let message = name + '님이 참여';

        io.sockets.emit('updateMessage', {
            name : 'SERVER',
            message : message
        });
    });

    socket.on('disconnect', function() {
        let message = socket.name + '님이 퇴장';
        socket.broadcast.emit('updateMessage', {
            name : 'SERVER',
            message : message
        });
    });

    socket.on('sendMessage', function(data) {
        data.name = socket.name;
        io.sockets.emit('updateMessage', data);
    });
});

server.listen(8080, function() {
    console.log('서버 실행중...')
});


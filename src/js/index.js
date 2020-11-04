// index.js (클라이언트)

'use strict';

let socket = io();

socket.on('connect', ()=> {
    let name = prompt('대화명을 입력해주세요.', '');
    socket.emit('newUserConnect', name);
});

let chatWindow = document.getElementById('chatWindow');
socket.on('updateMessage', function(data){
    if(data.name=== 'SERVER') {
    let infoEl = document.getElementById('info');
    infoEl.innerHTML = data.message;

    setTimeout(()=> { // 자동으로 이름을 지워줌
        infoEl.innerText = '';
    },1000);

    } else {
        let chatMessageEI = drawChatMessage(data);
        chatWindow.appendChild(chatMessageEI);
        chatWindow.scrollTop = chatWindow.scrollHeight; // 스크롤 자동으로 아래로 고정

    }
});

function drawChatMessage(data) {
    let wrap = document.createElement('p'); 
    let message = document.createElement('span'); 
    let name = document.createElement('span'); 
    
    name.innerText = data.name; 
    message.innerText = data.message; 
    
    name.classList.add('output__user__name'); 
    message.classList.add('output__user__message'); 
    
    wrap.classList.add('output__user'); 
    wrap.dataset.id = socket.id; 
    wrap.appendChild(name); 
    wrap.appendChild(message);

    return wrap;
}

let sendButton = document.getElementById('chatMessageSendBtn');
let chatInput = document.getElementById('chatInput');

function sendFunc(){
    let message = chatInput.value;

    if(!message) return false;

    socket.emit('sendMessage', {
        message
    })

    chatInput.value ='';
}

sendButton.addEventListener('click', ()=> {
    sendFunc();
});

document.addEventListener('keydown', (e)=> {
    if(e.key =="Enter" ) {
        sendFunc();
    }
});

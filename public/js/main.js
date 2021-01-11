const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chat room
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    console.log(message);
    //Message from server
    outputMessage(message);

    //Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight

});

//Message Submit listener
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get message text value typed and submitted.
    const msg = e.target.elements.msg.value;

    //Emitting a message to the server.
    socket.emit('chatMessage', msg);

    //Clear input & focus
    e.target.elements.msg.value = ``;
    e.target.elements.msg.focus();

});

//Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.userName}<span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
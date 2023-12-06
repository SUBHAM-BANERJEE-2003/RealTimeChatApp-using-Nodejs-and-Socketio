const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomSection = document.getElementById('room-name')
const userList = document.getElementById('users')
//Get username and room from the URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom', { username, room })

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outpuRoomName(room)
    outputUsers(users)
})

//message submit
socket.on('message', message => {
    console.log(message)

    OutgoingMessage(message)

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Getting the message from the client
    const msg = e.target.elements.msg.value;

    //emmiting the got message
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

//Output message
function OutgoingMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

//Add room name to dom 
function outpuRoomName(room) {
    roomSection.innerText = room
}

//Add users to dom
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}
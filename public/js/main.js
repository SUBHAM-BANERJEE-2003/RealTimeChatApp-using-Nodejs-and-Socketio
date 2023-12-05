const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const socket = io();

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
    div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}
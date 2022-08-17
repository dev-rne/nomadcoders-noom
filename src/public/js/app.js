const socket = io();

const welcome = document.getElementById("welcome")
const form = welcome.querySelector('form')
const room = document.getElementById("room");

room.hidden = true;

let roomName;
let nickName;

function handleMessageSubmit (event){
    event.preventDefault()
    const input = room.querySelector("#msg input");
    const value = input.value
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    })
    input.value = ""
}

function addMessage(message){
    const ul = room.querySelector('ul')
    const li = document.createElement('li')
    li.innerText = message;
    ul.append(li)
}
const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3')
    h3.innerText = `Room ${roomName} | User ${nickName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit)
}

function handleRoomSubmit(event){
    event.preventDefault();
    const roomInput = form.querySelector('.roomname');
    const nickInput = form.querySelector(".nickname");
    socket.emit("nickname", nickInput.value)
    socket.emit("enter_room", roomInput.value, showRoom);
    roomName = roomInput.value
    nickName = nickInput.value
    roomInput.value = ''
    nickInput.value = ''
}
form.addEventListener("submit", handleRoomSubmit)


socket.on("welcome",(user) => addMessage(`${user} arrived✨`))

socket.on("bye", (left) => {
    addMessage(`${left} left 😥`)
})

socket.on("new_message", addMessage)

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        roomList.innerHTML = "";
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
})
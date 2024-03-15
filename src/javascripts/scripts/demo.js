import {io} from 'socket.io-client';




export default async function() {
    let socket = await io({
        host: window.location.hostname
    });
    let message_history = document.getElementById('message-history');
    let send_btn = document.getElementById('send-message-btn');

    /**
     * 
     * @type {HTMLInputElement}
     */
    let message_input = document.getElementById('message-input');

    socket.emit('join-demo-room', ROOM_ID);

    let send_listener = (ev) => {
        ev.preventDefault();
        socket.emit('send-message', ROOM_ID, {
            content: message_input.value
        });

        let text_content = document.createElement('p');
        // rememeber, one class for message, one class for if its this user or other user
        text_content.classList.add('message', 'client');
        text_content.innerHTML = message_input.value;
        message_history.appendChild(text_content);
    }

    socket.on('message-recieved', (message) => {

        let text_content = document.createElement('p');
        // rememeber, one class for message, one class for if its this user or other user
        text_content.classList.add('message', 'other');
        text_content.innerHTML = message.content;
        message_history.appendChild(text_content);

    });
    
    socket.on('user-joined', (user) => {
        let u_info = document.createElement('p');
        u_info.id = 'user-join-flash';
        u_info.classList.add('user-join');
        u_info.innerHTML = 'user ' + user.username + ' joined.'

        setTimeout(() => {
            document.removeChild(u_info);
        }, 3000);
    })
    

    
    send_btn.addEventListener('click', send_listener);
}
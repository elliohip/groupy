import {io} from 'socket.io-client';




export default async function() {
    let socket = await io({
        host: window.location.hostname
    });
    let message_history = document.getElementById('message-history');
    let send_btn = document.getElementById('send-message-btn');
    let typing_box = document.getElementById('typing-info');

    /**
     * 
     * @type {HTMLFormElement}
     */
    let msg_bar = document.getElementById('message-bar')

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

        socket.emit('typing-end', ROOM_ID);
        message_input.value = '';
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
    });

    socket.on('typing-start', () => {
        let typing_info = document.createElement('p');
        typing_info.innerHTML = '...'
        typing_info.classList.add('message', 'other');
        typing_info.id = 'other-typing';
        typing_box.appendChild(typing_info);
    });

    socket.on('typing-end', () => {
        let typing_info = document.getElementById('other-typing');
        typing_box.removeChild(typing_info);
    });

    message_input.addEventListener('input', (ev) => {
        if (ev.target.value == '') {
            socket.emit('typing-end', ROOM_ID);
        }
        else {
            socket.emit('typing-start', ROOM_ID);
        }
    });
    msg_bar.onsubmit = (ev) => {
        socket.emit('typing-end');
    }


    
    send_btn.addEventListener('click', send_listener);
}
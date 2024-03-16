import {io} from 'socket.io-client';




export default async function() {
    let socket = await io({
        host: window.location.hostname
    });
    let message_history = document.getElementById('message-history');
    let send_btn = document.getElementById('send-message-btn');

    let typing_box = document.getElementById('typing-info');
    let alert_box = document.getElementById('message-alert-box');

    let add_friend_button = document.getElementById('add-friend');

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


    socket.emit('join-random-room', ROOM_ID, USERNAME);

    let send_listener = (ev) => {
        ev.preventDefault();
        socket.emit('send-message', ROOM_ID, {
            username: USERNAME,
            content: message_input.value
        });

        let text_content = document.createElement('p');
        // rememeber, one class for message, one class for if its this user or other user
        text_content.classList.add('message', 'client');
        text_content.innerHTML = message_input.value;
        message_history.appendChild(text_content);
    }

    let add_friend_listener = (ev) => {
        ev.preventDefault();
        socket.emit('add-friend', ROOM_ID, USERNAME);
    }

    socket.on('message-recieved', async (message) => {

        let message_box = document.createElement('div');
        let user_info = document.createElement('small');
        let text_content = document.createElement('p');

        message_box.classList.add('message', 'other');
        text_content.innerHTML = message.content;
        user_info.innerHTML = 'from  ' + message.username;

        message_box.appendChild(user_info);
        message_box.appendChild(text_content);

        message_history.appendChild(message_box);

    });

    socket.on('client-joined', (user) => {
        let u_info = document.createElement('p');
        u_info.id = 'user-join-flash';
        u_info.classList.add('user-join');
        u_info.innerHTML = 'user ' + user + ' joined.'
        alert_box.appendChild(u_info);
        setTimeout(() => {
            alert_box.removeChild(u_info);
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

    message_input.addEventListener('keydown', (ev) => {
        if (ev.target.value == '') {
            socket.emit('typing-start', ROOM_ID);
        }
        
    });
    message_input.addEventListener('keyup', (ev) => {
        if (ev.target.value == '') {
            socket.emit('typing-end', ROOM_ID);
        }
    })
    msg_bar.addEventListener('submit', (ev) => {
        socket.emit('typing-end', ROOM_ID);
    });
    

    send_btn.addEventListener('click', send_listener);
}
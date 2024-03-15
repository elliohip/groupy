import {io} from 'socket.io-client';




export default async function() {
    let socket = await io({
        host: window.location.hostname
    });
    let message_history = document.getElementById('message-history');
    let send_btn = document.getElementById('send-message-btn');

    let add_friend_button = document.getElementById('add-friend');

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
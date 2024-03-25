import {io} from 'socket.io-client';

export default async function() {
    let socket = await io({
        host: window.location.origin
    });

    /**
    * @type {{
    *  user_id: String
    *  username: String
    *  socket_id: String
    * }}
    */
    var other_user = {
   
    }
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

    socket.on('connect', () => {
        socket.emit('join-random-room', ROOM_ID, socket.id, USER);
    });

    console.log(USER);

    let send_listener = (ev) => {
        ev.preventDefault();
        socket.emit('send-message', ROOM_ID, {
            username: USER.username,
            content: message_input.value
        });

        let text_content = document.createElement('p');
        // rememeber, one class for message, one class for if its this user or other user
        text_content.classList.add('message', 'client');
        text_content.innerHTML = message_input.value;
        message_history.appendChild(text_content);
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

    socket.on('client-joined', (client_id, user) => {

        let u_info = document.createElement('p');
        u_info.id = 'user-join-flash';
        u_info.classList.add('user-join');
        u_info.innerHTML = 'user ' + user.username + ' joined.'
        alert_box.appendChild(u_info);

        console.log(user.username);
        other_user.username = user.username;
        other_user.user_id = user.user_id;
        other_user.socket_id = client_id;

        socket.emit('respond-to-join', ROOM_ID, socket.id, USER);

        setTimeout(() => {
            alert_box.removeChild(u_info);
        }, 3000);
    });

    socket.on('respond-to-join', (rm_id, sock_id, user) => {
        other_user.socket_id = sock_id;
        other_user.user_id = user.user_id;
        other_user.username = user.username;
        console.log(rm_id);
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

    socket.on('friend-request', (socket_id, username, to_socket_id, friend_req_id) => {
        let friend_alert = document.createElement('div');
        friend_alert.classList.add('friend-request-alert');

        let friend_info = document.createElement('p');
        friend_info.innerHTML = `${username} added you as a friend`;

        let friend_request_actions = document.createElement('div');

        let accept_btn = document.createElement('button');
        let reject_btn = document.createElement('button');

        accept_btn.classList.add('accept', 'button');
        reject_btn.classList.add('reject', 'button');

        accept_btn.innerHTML = 'accept';
        reject_btn.innerHTML = 'reject';

        let accept_listener = async (ev) => {
            await (await fetch(`${window.location.origin}/api/friend-requests/${friend_req_id}/accept`, 
            {
                method: 'POST'
            })).json();
            accept_btn.classList.add('clicked');
            friend_request_actions.innerHTML = 'accepted'
            
        };
        let reject_listener = async (ev) => {
            await (await fetch(`${window.location.origin}/api/friend-requests/${friend_req_id}/reject`)).json();
            friend_request_actions.innerHTML = 'rejected'
        };

        accept_btn.addEventListener('click', accept_listener);
        reject_btn.addEventListener('click', reject_listener);


        friend_request_actions.append(accept_btn, reject_btn);

        friend_alert.append(friend_info, friend_request_actions);

        alert_box.appendChild(friend_alert);

        setTimeout(() => {
            alert_box.removeChild(friend_alert);
        }, 3000);
    })




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


    let add_friend = async (ev) => {
        ev.preventDefault();
        let s_id = other_user.user_id || '';
        console.log(other_user.user_id);
        let request = await (await fetch(`${window.location.origin}/api/friend-requests/${other_user.user_id}`, {
            method: 'POST',
            body: {
                to_id: other_user.user_id
            }
        })).json()
        socket.emit('add-friend', socket.id, USER, other_user.socket_id);

        add_friend_button.parentElement.removeChild(add_friend_button);

    }

    add_friend_button.addEventListener('click', add_friend);
    send_btn.addEventListener('click', send_listener);
}
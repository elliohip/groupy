import {io} from 'socket.io-client';




export default async function() {
    let socket = await io({
        host: window.location.origin
    });
    let message_history = document.getElementById('message-history');
    let send_btn = document.getElementById('send-message-btn');
    let typing_box = document.getElementById('typing-info');

    let alert_box = document.getElementById('message-alert-box');

    let http_room_id = SOCK_ROOM_ID.split("-")[1];
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
        socket.emit('join-demo-room', SOCK_ROOM_ID);
    });

    //socket.on('disconnect', () => {
    //    socket.emit('demo-left', ROOM_ID);
    //});

    let unload_func_help = (respo) => {

        if (respo.toLowerCase() == 'yes' || respo.toLowerCase() == 'y') {
            return;
        }
        else if (respo.toLowerCase() == 'no' || respo.toLowerCase() == 'n') {
            return 'no';
        }
        else {
            let respo2 = prompt('Answer must be y or n. Are you sure you want to leave? (yes/y or no/n)');
            unload_func_help(respo2);
        }
        return;
    }
    window.addEventListener('beforeunload', async (event) => {
        event.preventDefault();
        await fetch(`${window.location.origin}/api/tempchats/${http_room_id}/delete`, {
            method: 'DELETE'
        });
        socket.emit('user-left', SOCK_ROOM_ID);
        event.returnValue = true;
        return true;
    })

    // socket.on('close')

    socket.on('user-left', (user) => {
        console.log(user);
        alert_box.innerHTML = "<h1> User Left </h1>"
    });

    let send_listener = async (ev) => {
        ev.preventDefault();
        socket.emit('send-message', SOCK_ROOM_ID, {
            content: message_input.value
        });

        let text_content = document.createElement('p');
        // rememeber, one class for message, one class for if its this user or other user
        text_content.classList.add('message', 'client');
        text_content.innerHTML = message_input.value;
        
        if (message_history.firstChild) {
            message_history.firstChild.before(text_content);
        }
        else {
            message_history.appendChild(text_content);
        }

        socket.emit('typing-end', SOCK_ROOM_ID);
        message_input.value = '';
    }

    socket.on('message-recieved', (message) => {

        let text_content = document.createElement('p');
        // rememeber, one class for message, one class for if its this user or other user
        text_content.classList.add('message', 'other');
        text_content.innerHTML = message.content;
        if (message_history.firstChild) {
            message_history.firstChild.before(text_content);
        }
        else {
            message_history.appendChild(text_content);
        }


    });

    socket.on('user-joined', (user) => {
        let u_info = document.createElement('h1');
        u_info.classList.add('user-join-flash');
        u_info.innerHTML = 'user  joined.';

        alert_box.appendChild(u_info);

        setTimeout(() => {
            let elms = document.querySelectorAll('.user-join-flash');
            elms.forEach((remove_elm) => {
                alert_box.removeChild(remove_elm);
            });
        }, 5000);
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
            socket.emit('typing-start', SOCK_ROOM_ID);
        }
        
    });
    message_input.addEventListener('keyup', (ev) => {
        if (ev.target.value == '') {
            socket.emit('typing-end', SOCK_ROOM_ID);
        }
    })
    msg_bar.addEventListener('submit', (ev) => {
        socket.emit('typing-end', SOCK_ROOM_ID);
    });
    
    
    send_btn.addEventListener('click', send_listener);
}
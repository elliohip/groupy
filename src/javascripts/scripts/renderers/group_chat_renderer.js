import { Socket } from "socket.io-client";

/**
 * 
 * @param {String} u_or_o either 'client' or 'other'
 * @param {{
 *  user_id: String,
 *  username: String
 * }} user user that sent message
 * @param {{
 *  value: String
 * }} inpt 
 * @returns 
 */
const render_group_message = (u_or_o, user, inpt) => {
    let messg_bx = document.createElement('div');
    let text_content = document.createElement('p');
        // rememeber, one class for message, one class for if its this user or other user
    let user_pfp = document.createElement('img');

    let u_info = document.createElement('div');
    u_info.classList.add('message-user-info');

    

    let u_nm = document.createElement('small')
    u_nm.innerHTML = user.username;

    user_pfp.classList.add('message-pfp');
    user_pfp.src = `/api/users/photos/pfp-by-id/${user.user_id}`

    u_info.append(user_pfp, u_nm);

    messg_bx.classList.add('message', u_or_o);
    text_content.classList.add('message-text', u_or_o);
    text_content.innerHTML = inpt.value;

    messg_bx.append(u_info, text_content);
    return messg_bx;
};


/**
 * 
 * @param {Socket} socket 
 * @param {String} curr_room_id string for the id of the current room "group-<GRP_ID>"
 * @param {String} prev_room_id
 */
export async function render_group_chat(socket, http_grp_id) {

    
    let main_display = document.getElementById('main-display');
    main_display.innerHTML = `
        <div id="groupchat-actions">

        </div>
        <div id="message-alert-box">

        </div>
        <div id="message-history">

        </div>
        <div id="typing-info">
          
        </div>
        <form id="message-bar">
            <input placeholder="enter message" type="text" id="message-input">
            <input type="submit" value="send" id="send-message-btn" class="button">
        </form>
    
    `;

    let curr_room_id = `group-${http_grp_id}`;

    let prev_msgs = await (await fetch(`${window.location.origin}/api/messages/${http_grp_id}/`)).json();

    let message_history = document.getElementById('message-history');
    let send_btn = document.getElementById('send-message-btn');
    let typing_box = document.getElementById('typing-info');

    let alert_box = document.getElementById('message-alert-box');
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

    /**
     * @type {HTMLDivElement[]}
     */
    let msg_elements = [];

    for (let i = prev_msgs.length - 1; i > 0; i--) {
        let c_or_o = '';

        if (prev_msgs[i].user_id == USER.user_id) {
            c_or_o = 'client';
        } else {
            c_or_o = 'other';
        }
        msg_elements.push(render_group_message(c_or_o, {
            user_id: prev_msgs[i].user_id,
            username: prev_msgs[i].username
        }, {
            value: prev_msgs[i].text
        }));
    }

    let has_msg = message_history.children[1];
    if (has_msg) {

        message_history.children[1].before(...msg_elements);

    } else {
        message_history.append(...msg_elements);
    }

    /* socket.on('connect', () => {
        socket.emit('join-group', curr_room_id);
    }); */
    /* for refactoring
    let check_connected = () => {
        if (socket.connected) {
            socket.emit('join-group', curr_room_id);
        }
        else {
            setTimeout(check_connected, 10);
        }
    }
    */
    if (socket.connected) {
        socket.emit('join-group', curr_room_id);
    }
    
    socket.on('message-from-group', (rm_id, message) => {
        let cur_id = rm_id;
        console.log("message recieved");
        if (rm_id == http_grp_id) {
            let messg = render_group_message('other', {
                user_id: message.user_id, 
                username: message.username
            }, {
                value: message.text
            });
            message_history.appendChild(messg);
        } else {
            let msg_prev = document.querySelector(`#${rm_id} .msg-preview`);
            msg_prev.innerHTML = `${message.username}: ${message.text}`;
        }

    });

    //socket.on('disconnect', () => {
    //    socket.emit('demo-left', curr_room_id);
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
    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        socket.emit('user-left', curr_room_id);
        event.returnValue = true;
        return true;
    })

    // socket.on('close')

    let send_listener = (ev) => {
        ev.preventDefault();
        socket.emit('message-to-group', curr_room_id, {
            user_id: USER.user_id,
            username: USER.username,
            text: message_input.value,
        });

        let text_content = render_group_message('client', {
            user_id: USER.user_id,
            username: USER.username
        }, {
            value: message_input.value
        });
        /* rememeber, one class for message, one class for if its this user or other user
        text_content.classList.add('message', 'client');
        text_content.innerHTML = message_input.value;*/
        message_history.appendChild(text_content);

        // socket.emit('typing-end', curr_room_id);
        message_input.value = '';
    }

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
    
    
    send_btn.addEventListener('click', send_listener);

}

/**
 * renders a li with the id passed through,
 * this is meant to be inserted into a list of chats
 * @param {*} group_id String for group id
 */
async function render_chat_list_item(group_id) {
    let group = await ((await fetch(`${window.location.origin}/api/groups/by-id/${group_id._id}`))).json().text;
    
    let latest_msg = await (await fetch(`${window.location.origin}/api/messages/${group_id._id}/latest-msg`)).json().text;
    // console.log(group_id);

    let gc_li = document.createElement('li');
    gc_li.id = `group-${group_id._id}`;

    let gc_img = document.createElement('img');
    gc_img.classList.add('group-img');
    // gc_img.src = `${window.location.origin}/api/groups/`;
    gc_img.src = `${window.location.origin}/api/groups/group-photo-default`;

    gc_li.appendChild(gc_img);
    let current_message_info = document.createElement('p');
    current_message_info.classList.add('group-name')

    current_message_info.innerHTML = group_id.group_name;

    let u_msg_content = document.createElement('small');
    u_msg_content.classList.add('current-message');

    u_msg_content.innerHTML = latest_msg;

    gc_li.append(current_message_info, u_msg_content);

    gc_li.classList.add('group-chat');

    return gc_li;
}

export async function render_chat_bar(socket, groups) {
    let groups_list = document.getElementById('chats-list');
    let rt_list = [];
    if (groups.length == 0) {
        groups_list.innerHTML = 'no groups';
    }
    for (let i = 0; i < groups.length; i++) {
        let list_item = await render_chat_list_item(groups[i]);
        groups_list.appendChild(list_item);
        rt_list.push(list_item);
    }
    return rt_list;
}


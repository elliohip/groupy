import { GLOBALS } from "../../globals";

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
export const render_direct_message = (u_or_o, user, inpt) => {
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
 * renders a li with the id passed through,
 * this is meant to be inserted into a list of chats
 * @param {*} group_id String for group id
 */
async function render_dm_list_item(dm_history_id) {
    let dm_history = dm_history_id.messages;
    
    // let latest_msg = await (await fetch(`${window.location.origin}/api/messages/${dm_history_id._id}/latest-msg`)).json().text;
    // console.log(dm_history_id);

    let gc_li = document.createElement('li');
    gc_li.id = `DMHistory-${dm_history_id._id}`;

    let gc_img = document.createElement('img');
    gc_img.classList.add('group-img');
    // gc_img.src = `${window.location.origin}/api/groups/`;
    gc_img.src = `${window.location.origin}/api/groups/group-photo-default`;

    gc_li.appendChild(gc_img);
    let current_message_info = document.createElement('p');
    current_message_info.classList.add('group-name')
    let o_usr = dm_history_id.users.filter((val) => val != USER.user_id)[0];
    current_message_info.innerHTML = o_usr;

    let u_msg_content = document.createElement('small');
    u_msg_content.classList.add('current-message');

    // u_msg_content.innerHTML = latest_msg;

    gc_li.append(current_message_info, u_msg_content);

    gc_li.classList.add('group-chat');

    return gc_li;

}

export const render_direct_message_bars = async (groups) => {

    let groups_list = document.getElementById('chats-list');
    groups_list.innerHTML = ""

    let rt_list = [];
    if (groups.length == 0) {
        groups_list.innerHTML = 'no direct messages';
    }
    for (let i = 0; i < groups.length; i++) {
        let list_item = await render_dm_list_item(groups[i]);
        groups_list.appendChild(list_item);
        console.log(groups[i]._id);
        rt_list.push(list_item);
    }
    return rt_list;
}

/**
 * 
 * @param {Socket} socket 
 * @param {*} http_grp_id
 * @param {String} o_user_id
 */
export async function render_direct_message_history(socket, http_grp_id, o_user_id) {
    
    let main_display = document.getElementById('main-display');
    main_display.innerHTML = "";
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

    let curr_room_id = `DMHistory-${http_grp_id._id}`;

    let prev_msgs = http_grp_id.messages
    console.log(prev_msgs);

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

    for (let i = prev_msgs.length - 1; i > 0 ; i--) {
        let c_or_o = '';

        if (prev_msgs[i].from_id == USER.user_id) {
            c_or_o = 'client';
        } else {
            c_or_o = 'other';
        }
        msg_elements.push(render_direct_message(c_or_o, {
            user_id: prev_msgs[i].from_id,
            username: ""
        }, {
            value: prev_msgs[i].text_content
        }));
    }

    let has_msg = document.getElementById('message-history').children[1];
    if (has_msg) {
        if (msg_elements.length > 0) {
            message_history.children[0].before(...(msg_elements.reverse()));
        }

    } else {
        // message_history.append(...(msg_elements.reverse()));
        if (msg_elements.length > 0) {
            message_history.appendChild(msg_elements[0]);
            msg_elements[0].after(...(msg_elements.slice(1)));
        }
        /*
        for (let i = 1; i < msg_elements.length; i++) {
            msg_elements[i - 1].after()
            // message_history.insertBefore(msg_elements[i], )
            
        }*/
    }

    socket.on('connect', () => {
        socket.emit('join-group', curr_room_id);
    }); 
    /* for refactoring
    let check_connected = () => {
        if (socket.connected) {
            socket.emit('join-group', curr_room_id);
        }
        else {
            setTimeout(check_connected, 10);
        }
    }*/
    

    if (socket.connected) {
        socket.emit('join-group', curr_room_id);
    }
    
    socket.on('message-from-group', (rm_id, message) => {
        // let cur_id = rm_id;
        console.log(` message from group! 
            room_id: DMHistory-${rm_id}
            http_room_id: DMHistory-${http_grp_id._id}
            `);
            
        if (rm_id == GLOBALS.http_group_id) {
            let messg = render_direct_message('other', {
                user_id: message.user_id, 
                username: message.username
            }, {
                value: message.text
            });
            message_history.insertBefore(messg, message_history.firstChild);
            let msg_prev = document.querySelector(`#DMHistory-${rm_id} small.current-message`);
            console.log(`${message.username}: ${message.text}`)
            msg_prev.innerHTML = `${message.username}: ${message.text}`;
        } else {
            console.log(rm_id);
            let msg_prev = document.querySelector(`#DMHistory-${rm_id} small.current-message`);
            console.log(`${message.username}: ${message.text}`)
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

    let send_listener = async (ev) => {
        ev.preventDefault();
        if (message_input.value.length > 500) {
            alert("messages can only be 500 chars long");
        }
        console.log(USER.username)
        await fetch(`${window.location.origin}/api/users/${USER.user_id}/direct-messages/${http_grp_id._id}/add-message?text=${message_input.value}&username=${USER.username}&user_id=${USER.user_id}&to_id=${o_user_id}&time_created=${Date.now()}`, {
            method: "PUT",
            body: {
                text: message_input.value
            }
        })
        console.log("sent to room : " + curr_room_id);
        socket.emit('message-to-group', curr_room_id, {
            user_id: USER.user_id,
            username: USER.username,
            text: message_input.value,
        });

        let text_content = render_direct_message('client', {
            user_id: USER.user_id,
            username: USER.username
        }, {
            value: message_input.value
        });
        /* rememeber, one class for message, one class for if its this user or other user
        text_content.classList.add('message', 'client');
        text_content.innerHTML = message_input.value;*/
        message_history.insertBefore(text_content, message_history.firstChild);

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

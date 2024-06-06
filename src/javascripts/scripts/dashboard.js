import { Socket, io } from "socket.io-client";
import { render_group } from "../services/group_service";

const render_funcs = await import("./renderers/group_chat_renderer");




var groups = [];

/**
 * stores the current group id
 * @type {String}
 */
var current_group = '';

var group_container = document.getElementById('chats-list');

var get_groups = async () => {
    return (await (await fetch(`${window.location.origin}/api/groups/get-user-groups`)).json());
}


/**
 * 
 * @param {group} group 
 * @param {Socket} socket 
 */
var create_group_btn = async (group, socket) => {
    let button = document.createElement('div');
    let btn_listner = (ev) => {
        render_group(group.solid_id);
        socket.emit('join-group', group.runtime_id, USER.user_id);
    }
    button.addEventListener('click',  btn_listner);

    button.innerHTML = (await (await fetch(`${window.location.origin}/api/groups/${group.solid_id}`)).json()).group_name | "unnamed group";

    group_container.appendChild(button);

}

export default async function () {

    let socket = io({
        host: window.location.origin
    });
    groups = await get_groups();
    console.log(groups);
    /**
     * 
     * @type {HTMLElement[]}
     */
    let rendered_groups = [];
    let current_group_id = groups[0]._id;
    if (!groups.length) {
        render_funcs.render_chat_bar(socket, groups);
        render_funcs.render_group_chat(socket, groups);
    } else {
        rendered_groups = await render_funcs.render_chat_bar(socket, groups);
        await render_funcs.render_group_chat(socket, groups[0]._id);
        current_group_id = 'group-' + groups[0]._id;

        for (let i = 0; i < rendered_groups.length; i++) {
            rendered_groups[i].addEventListener('click', (ev) => {

                document.getElementById(current_group_id).classList.remove('current-group-selected');
                current_group_id = ev.currentTarget.id;

                render_funcs.render_group_chat(socket, ev.currentTarget.id.split('-')[1]);

            });
        }
    }
    
}
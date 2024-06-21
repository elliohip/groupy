
import { render_group } from "../services/group_service";

const render_funcs = await import("./renderers/group_chat_renderer");

import { GLOBALS } from "../globals";

import { render_modal, render_modal_friend_requests } from "./renderers/modal_renderer";
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

export default async function (socket) {

    groups = await get_groups();
    console.log(groups);
    /**
     * 
     * @type {HTMLElement[]}
     */
    let rendered_groups = [];
    let current_group_id = groups[0]._id;

    let modal = render_modal();
    document.body.appendChild(modal);


    let friend_req_btn = document.getElementById("view-recent-friend-requests");

    friend_req_btn.addEventListener('click', async (ev) => {
        render_modal_friend_requests(modal, {x: ev.clientX, y: ev.clientY});
    })
    if (!groups.length) {
        render_funcs.render_chat_bar(socket, groups);
        render_funcs.render_group_chat(socket, groups);
    } else {
        
        rendered_groups = await render_funcs.render_chat_bar(socket, groups);
        await render_funcs.render_group_chat(socket, groups[0]._id, modal);
        GLOBALS.http_group_id = groups[0]._id;
        current_group_id = 'group-' + groups[0]._id;
        GLOBALS.http_group_id = groups[0]._id;
        document.getElementById(current_group_id).classList.add('current-group-selected');

        for (let i = 0; i < rendered_groups.length; i++) {
            rendered_groups[i].addEventListener('click', (ev) => {

                document.getElementById(current_group_id).classList.remove('current-group-selected');
                current_group_id = ev.currentTarget.id;
                GLOBALS.http_group_id = ev.currentTarget.id.split('-')[1];

                document.getElementById(current_group_id).classList.add('current-group-selected');
                render_funcs.render_group_chat(socket, ev.currentTarget.id.split('-')[1]);

            });
        }
    }
    
}
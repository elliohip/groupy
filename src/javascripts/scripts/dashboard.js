import { Socket, io } from "socket.io-client";
import { render_group } from "../services/group_service";

/**
 * @typedef {{
 *  solid_id: String,
 *  runtime_id: String  
 * }}
 */
var group;

/**
 * @type {group[]}
 */
var groups = [];

/**
 * @type {group}
 */
var current_group = {

};

var group_container = document.getElementById('chats-list');

var get_groups = async () => {
    await (await fetch(`${window.location.origin}/api/groups/get-user-groups`)).json();
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
        socket.emit('join-group', group.runtime_id, USER_ID);
    }
    button.addEventListener('click',  btn_listner);

    button.innerHTML = (await (await fetch(`${window.location.origin}/api/groups/${group.solid_id}`)).json()).group_name | "unnamed group";

    group_container.appendChild(button);

}

export default async function () {
    let socket = io({
        host: window.location.origin
    });
    groups = get_groups();

}
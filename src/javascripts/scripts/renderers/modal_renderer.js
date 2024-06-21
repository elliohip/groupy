import { Socket } from "socket.io-client";
import { GLOBALS } from "../../globals";
import { render_friend_request } from "./user_profile_render";

export class Modal extends HTMLDivElement {
    constructor(socket, group_id) {
        super()
        this.socket = socket;
        this.group_id = group_id;
        this.style.display = "absolute"
    }
    /**
     * 
     * @param {Socket} is_admin 
     * @param {String} group_id
     * @param {{
     *  x: Number,
     *  y: Number
     * }} position
     */
}

/**
 * 
 * @param {HTMLDivElement} modal 
 */
function show_modal(modal) {
    modal.hidden = false;
}

/**
 * 
 * @param {HTMLDivElement} modal 
 */
function hide_modal(modal) {
    modal.hidden = true;
}

/**
 * 
 * @param {HTMLDivElement} modal 
 */
function reset_modal(modal) {
    modal.innerHTML = "";
}

/**
 * 
 * @param {Socket} socket 
 * @param {String} group_id
 * @param {HTMLDivElement} modal
 */
async function render_add_user(socket, group_id, modal) {
    reset_modal(modal);

    modal.innerHTML = `

    <div id="close-modal">
            X
    </div>
    <div id="modal-add-user-form">
        <label> username: 
            <input name="username" id="modal-add-user-input">
        </label>
        <div id="modal-add-user-submit">
            submit
        </div>
    </div>

    `

    document.getElementById("close-modal").addEventListener("click", (ev) => {
        modal.innerHTML = "";
        modal.hidden = true;
    });
    document.getElementById("modal-add-user-submit").addEventListener('click', async (ev) => {
        ev.preventDefault();

        let input_data = document.getElementById("modal-add-user-input").value;

        await fetch(`${window.location.origin}/api/groups/add-user/${group_id}?user_id=${input_data}`, 
            {
                method: 'PUT', 
                
            }
        );

    });

}


async function render_current_users(group_id, modal) {
    modal.innerHTML = "";
    modal.innerHTML = `
    <div id="close-modal">
            X
    </div>
    <ul></ul>
    `;

    document.getElementById("close-modal").addEventListener("click", (ev) => {
        modal.innerHTML = "";
        modal.hidden = true;
    });

    /**
     * @type {HTMLUListElement}
     */
    let list_elemnt = modal.querySelector('ul');
    list_elemnt.style.maxWidth = "150px";
    list_elemnt.style.maxHeight = "450px";
    list_elemnt.style.overflow = "scroll";

    /**
     * @type {[*]}
     */
    let friends = await (await fetch(`${window.location.origin}/api/users/${USER.user_id}/friends`)).json();

    let render_user_info = (user) => {
        let list_box = document.createElement('li');

        let user_info = document.createElement('p');
        let img = document.createElement('img');
        let add_friend_img = null;

        if (!(friends.includes(user._id)) && user._id != USER.user_id) {
            add_friend_img = document.createElement("img");
            add_friend_img.addEventListener('click', async (ev) => {
                ev.preventDefault();
                await (await fetch(`${window.location.origin}/api/friend-requests?to_id=${user._id}`, {
                    method: 'POST'
                })).json()
            });
            add_friend_img.src = '/assets/add-friend-svgrepo-com.svg';
            add_friend_img.classList.add("message-pfp");
        }

        list_box.style.display = "flex";
        list_box.style.flexFlow = "row";
        img.src = `${window.location.origin}/api/users/photos/pfp-by-id/${user._id}`;
        user_info.innerHTML = user.username;
        img.classList.add("message-pfp");
        if (add_friend_img != null) {
            list_box.append(img, user_info, add_friend_img)
        }
        else {
            list_box.append(img, user_info)
        }
        return list_box;
    }

    let group = await (await fetch(`${window.location.origin}/api/groups/by-id/${group_id}`)).json();
    if (!group) {
        return;
    }
    for (let i = 0; i < group.users.length; i++) {
        if (group.users[i]) {
            let user = await ((await fetch(`${window.location.origin}/api/users/${group.users[i]}`))).json();

            list_elemnt.appendChild(render_user_info(user))
        }

    }
    show_modal(modal);
}

/**
 * 
 * @param {Socket} socket 
 * @param {String} group_id 
 * @param {{
 *  x: Number,
 *  y: Number
 * }} position 
 * @param {HTMLDivElement} modal 
 */
export function render_gc_edit_options(socket, group_id, position, modal) {
    reset_modal(modal);
    modal.style.left = String(position.x) + "px";
    modal.style.top = String(position.y) + "px";

    modal.innerHTML = `
        <div id="close-modal">
            X
        </div>
        <div>
            <div class="button modal-button" id="modal-add-to-group">
                add to group
            </div>
            <div class="button modal-button" id="modal-view-current-users">
                view users
            </div>
            <div class="button rename-group" id="modal-rename-group">
                rename group
            </div>
            <div class="button leave-group" id="modal-leave-group">
                leave group
            </div>
        </div>
    `;

    document.getElementById("modal-view-current-users").addEventListener('click', (ev) => {
        render_current_users(GLOBALS.http_group_id, modal)
    })
    document.getElementById("close-modal").addEventListener("click", (ev) => {
        modal.innerHTML = "";
        modal.hidden = true;
    });

    document.getElementById("modal-add-to-group").addEventListener('click', (ev) => {

        render_add_user(socket, group_id, modal);
    });
    /*this.querySelector("div .button.rename-group").addEventListener("click", (ev) => {
        
    });
    this.querySelector("div .button.rename-group").addEventListener("click", (ev) => {

    });*/

    show_modal(modal);
}

/**
 * 
 * @param {HTMLDivElement} modal 
 * @param {{
 *  x: Number,
*  y: Number
* }} position 
 */
export async function render_modal_friend_requests(modal, position) {
    reset_modal(modal);
    modal.innerHTML = ""
    modal.innerHTML = `
    <div id="close-modal">
            X
    </div>
    
    `

    modal.style.top = position.y + 'px';
    modal.style.left = position.x + 'px';

    let list = document.createElement('ul');
    list.classList.add('friend-request-list');

    let requests = await (await fetch(`${window.location.origin}/api/friend-requests/${USER.user_id}/to`)).json();

    for (let i = 0; i < requests.length; i++) {

        let request = requests[i];
        let user = await (await fetch(`${window.location.origin}/api/users/${request.from_id}`)).json();
        list.appendChild(render_friend_request(request, user));
        
    }
    modal.appendChild(list);
    show_modal(modal);
}

/**
 * 
 * @returns {HTMLDivElement}
 */
export function render_modal() {
    let m = document.createElement('div');
    m.style.position = "absolute"
    m.hidden = true;
    return m;
}

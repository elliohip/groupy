
/**
 * 
 * @param {*} group_id 
 * @returns {[]}
 */
async function get_group_messages(group_id) {
    return await (await fetch(`${window.location.origin}/api/groups/${group_id}/messages`, {
        method: 'GET'
    })).json();

}

async function render_message(message, display) {
    let message_box = document.createElement('div');
    let user_info_box = document.createElement('div');
    let user_info = document.createElement('small');
    let user_pfp = document.createElement('img');

    user_pfp.classList.add('profile-pic');
    let text_content = document.createElement('p');

    text_content.innerHTML = message.text;
    user_info.innerHTML = 'from  ' + message.username;

    if (message.username == USERNAME) {
        message_box.classList.add('message', 'client');
    } else {
        message_box.classList.add('message', 'other');
    }

    user_pfp.src = `${window.location.origin}/api/users/photos/pfp?user_id=${message.user_id}`;

    user_info_box.appendChild(user_pfp);
    user_info_box.appendChild(user_info);
    message_box.appendChild(user_info_box);
    message_box.appendChild(text_content);

    display.appendChild(message_box);

}

export async function render_group(group_id) {
    var messages = (await get_group_messages()).sort((a, b) => {
        if (a.createdAt > b.createdAt) {
            return 1;
        }
        else if (a.createdAt < b.createdAt) {
            return -1;
        }
        else {
            return 0;
        }
    });

    var main_display = document.getElementById('main-display');

    for (let message in messages) {
        render_message(message, main_display);
    };

}

export async function get_groups() {
    let data = await (await fetch(`${window.location.origin}/api/groups`, {
        method: 'GET'
    })).json();

    if (data.message) {
        let p = document.createElement('p');
        p.innerHTML = 'no groups';
        return p;
    }

    return data;

}

/**
 * 
 * @param {String[]} group_ids 
 */
export async function render_groups(group_ids) {

    let temp  = `
    <li class="group-tab">
        <img class="group-pic">
        <p class="group-name">
        </p>
        <p class="latest-message">
        </p>
    </li>
    `

    for (let i = 0; i < group_ids.length; i++) {
        let g = await (await fetch(`${window.location.origin}/api/groups/${group_ids[i]}`, {
        method: 'GET'
        })).json();

        if ((g.message)) {
            break;
        }
        let l = document.createElement('li');
        let grp_nm = document.createElement('p');
        let latest_msg = document.createElement('p');

        




    }

    return 
}
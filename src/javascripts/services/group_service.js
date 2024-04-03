
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
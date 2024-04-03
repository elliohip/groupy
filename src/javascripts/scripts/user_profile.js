
const photo_man_btn = document.getElementById('photo-manager');
const friend_man_btn = document.getElementById('friend-manager');
const request_man_btn = document.getElementById('friend-request-manager');

const profile_info = document.getElementById('profile-info');

async function render_photos(ev) {
    profile_info.innerHTML = '';


    let upload_form = document.createElement('form');
    // upload_form.enctype ="multipart/form-data";
    let input = document.createElement('input');
    input.name = 'photo_up'
    let submit = document.createElement('input');

    let submit_listener = async (ev) => {
        ev.preventDefault();
        let form = new FormData(upload_form);
        await fetch(`${window.location.origin}/register/body-check`, {
            method: 'POST', 
            body: {
                data: input.value
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    submit.type = 'submit';
    submit.value = 'add picture';

    submit.addEventListener('click', submit_listener);

    input.type = 'text';
    // input.accept = "image/png, image/jpeg";
    upload_form.method = 'POST';
    upload_form.action = `/api/users/photos?user_id=${USER_ID}`;

    upload_form.appendChild(input);
    upload_form.appendChild(submit);

    let photo_box = document.createElement('div');
    photo_box.id = 'photo-box';

    let photos = (await (await fetch(`${window.location.origin}/api/users/photos/user-photos?user_id=${USER_ID}`, {method:'GET'})).json());

    let render_photo_function = (photo_id) => {
        let photo = document.createElement('img');
        photo.classList.add('photo-box');
        photo.src=`${window.location.origin}/users/photos?user_id=${USER_ID}&photo_id=${photo_id}`;
        photo_box.appendChild(photo);
    }

    for (let p in photos) {
        render_photo_function(p);
    }

    profile_info.appendChild(photo_box);
    profile_info.appendChild(upload_form);

}

async function render_friends() {

}

async function render_friend_requests() {

}

export default async function () {
    photo_man_btn.addEventListener('click', render_photos);

}
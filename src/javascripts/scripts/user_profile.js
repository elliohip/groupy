import on_div_load from "../services/img_loaders/on_div_load";
import on_img_load from "../services/img_loaders/on_img_load";
import { render_friend, render_friend_request } from "./renderers/user_profile_render";

const photo_man_btn = document.getElementById('photo-manager');
const friend_man_btn = document.getElementById('friend-manager');
const request_man_btn = document.getElementById('friend-request-manager');

const profile_info = document.getElementById('profile-info');

var curr_class = '';

async function render_photos(ev) {
    if (curr_class !== '') {
        profile_info.classList.remove(curr_class);
    }
    profile_info.innerHTML = '';

    profile_info.innerHTML += `
    <h1 id="profile-info-head">
        Current Photos
    </h1>
    `

    profile_info.classList.add('photos');
    curr_class = 'photos';
    let form_temp = `
    <div id="drag-box-photo">
        <form method="POST" action="/api/users/photos" id="create-new-photo">
            <input name="photo_up" type="file" accept="image/png, image/jpeg">
            <input type="submit" value="add picture">
        </form>
        <div id="photo-preview">
        <div>
    <div>
    `
    let photo_box = document.createElement('div');
    photo_box.id = 'photo-box';

    let photos = (await (await fetch(`${window.location.origin}/api/users/photos/user-photos?user_id=${USER_ID}`, {method:'GET'})).json());

    let render_photo_function = (photo_id) => {
        // let load_div = document.createElement('div');
        // load_div.classList.add('load-div');

        let photo = document.createElement('img');
        photo.classList.add('user-profile-photo', 'loading');

        photo.src=`${window.location.origin}/api/users/photos/by-id?user_id=${USER_ID}&photo_id=${photo_id}`;

        return {
            photo
        }
    }

    for (let i = 0; i < photos.length; i++) {
        let {photo} = render_photo_function(photos[i]);
        let photo_lisnr = (ev) => {
            /*
            let load_parent = load_div.parentElement;
            load_div.parentElement.removeChild(load_div);
            photo.classList.remove('loading');
            photo.classList.add('loaded');
            */
           ev.target.classList.remove('loading');
        };

        photo.onload = photo_lisnr;
        photo_box.appendChild(photo);

        // photo_box.appendChild(load_div);
    }

    profile_info.appendChild(photo_box);

    profile_info.innerHTML += form_temp;

    /**
     * @type {HTMLFormElement}
     */
    let form_elm = document.getElementById('create-new-photo');
    let drag_box = document.getElementById('drag-box-photo');

    // drag-drop-functionality
    let stop_drag =  (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event_name => {
        drag_box.addEventListener(event_name, stop_drag, false)
      })

    let highlight = (e) => {
        drag_box.classList.add('highlight')
    };
    let unhighlight = (e) => {
        drag_box.classList.remove('highlight')
      }
    ['dragenter', 'dragover'].forEach(event_name => {
        drag_box.addEventListener(event_name, highlight, false)
    });
    ['dragleave', 'drop'].forEach(eventName => {
        drag_box.addEventListener(eventName, unhighlight, false)
    });
    let handle_drop = async (e) => {
        let dt = e.dataTransfer
        let files = dt.files
      
        await handle_files(files);
    }
    let preview_file = (file) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function() {
          let img = document.createElement('img');
          
          img.classList.add();
          img.src = reader.result;
          photo_box.appendChild(img);
        }
    }
    let handle_previews = (files) => {
        files.forEach(preview_file);
    }
    let handle_files = async (files) => {
        files = [...files];
        upload_file(files[0]);
        let reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onloadend = function() {
          let img = document.createElement('img');
          
          img.classList.add();
          img.src = reader.result;
          photo_box.appendChild(img);
        }
        // files.forEach(await Promise.resolve(upload_file));
        // ([...files]).forEach(await (Promise.resolve(upload_file)));
    };
    let upload_file = async (file) => {
        let url = `${window.location.origin}/api/users/photos`
        let form_data = new FormData()
      
        form_data.append('photo_up', file)
        await fetch(url, {
            method: 'POST',
            body: form_data
        });
    };
    drag_box.addEventListener('drop', handle_drop, false);

    form_elm.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        let frm_dat = new FormData(form_elm);
        await fetch(`${window.location.origin}/api/users/photos`, {
            method: 'POST',
            body: frm_dat, // headers: {"Content-Type": "multipart/form-data"}
            
        });
    })

}

async function render_friends(ev) {

    if (curr_class !== '') {
        profile_info.classList.remove(curr_class);
    }

    profile_info.classList.add('friends');
    profile_info.innerHTML = '';
    profile_info.innerHTML += `
    <h1 id="profile-info-head">
        Current Friends
    </h1>
    `

    curr_class = 'friends';
    let friend_box = document.createElement('ul');
    friend_box.classList.add('friend-list');

    let friends = await (await fetch(`${window.location.origin}/api/users/${USER.user_id}/friends`)).json();

    for(let i = 0; i < friends.length; i++) {
        let friend = await (await fetch(`${window.location.origin}/api/users/${friends[i]}`)).json();
        friend_box.appendChild(render_friend(friend));
    }

    profile_info.appendChild(friend_box);
}

async function render_friend_requests(ev) {
    if (curr_class !== '') {
        profile_info.classList.remove(curr_class);
    }
    // `${window.location.origin}/api/users/${}`
    profile_info.innerHTML = ''

    profile_info.innerHTML += `
    <h1 id="profile-info-head">
        Current Friend Requests
    </h1>
    `
    let list = document.createElement('ul');
    list.classList.add('friend-request-list');
    curr_class = 'friend-requests';
    profile_info.classList.add('friend-requests');

    let requests = await (await fetch(`${window.location.origin}/api/friend-requests/${USER.user_id}/to`)).json();

    for (let i = 0; i < requests.length; i++) {
        let request = requests[i];
        let user = await ((await fetch(`${window.location.origin}/api/users/${request.from_id}`)).json());
        list.appendChild(render_friend_request(request, user));
    }

    profile_info.appendChild(list);
}

export default async function () {
    photo_man_btn.addEventListener('click', render_photos);
    friend_man_btn.addEventListener('click', render_friends);
    request_man_btn.addEventListener('click', render_friend_requests);

}
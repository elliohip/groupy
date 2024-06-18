import dashboard from './scripts/dashboard';
import demo from './scripts/demo';
import direct_messages from './scripts/direct_messages';
import random_chat from './scripts/random_chat'
import user_profile from './scripts/user_profile';
import on_img_load from './services/img_loaders/on_img_load';

import { Socket, io } from "socket.io-client";

let path_arr = window.location.pathname.split('/');

let images = document.querySelectorAll('img');


images.forEach((image) => {
    image.addEventListener('load', (ev) => {
        ev.target.classList.remove('loading');
    });
})
if (path_arr.includes('demo')) {
    await demo();
} else if (path_arr.includes('random-chat')) {
    await random_chat();
} else if (path_arr.includes('dashboard')) {
    let socket = io({
        host: window.location.origin
    });
    await dashboard(socket);
} else if (path_arr.includes('user-profile')) {
    await user_profile();
} else if (path_arr.includes('view-direct-messages')) {
    let socket = io({
        host: window.location.origin
    });
    socket.connect();
    await direct_messages(socket);
}
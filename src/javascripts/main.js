import dashboard from './scripts/dashboard';
import demo from './scripts/demo';
import random_chat from './scripts/random_chat'
import user_profile from './scripts/user_profile';
import on_img_load from './services/img_loaders/on_img_load';
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
    await dashboard();
} else if (path_arr.includes('user-profile')) {
    await user_profile();
}
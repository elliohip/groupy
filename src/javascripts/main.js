import dashboard from './scripts/dashboard';
import demo from './scripts/demo';
import random_chat from './scripts/random_chat'
import user_profile from './scripts/user_profile';
let path_arr = window.location.pathname.split('/');


if (path_arr.includes('demo')) {
    await demo();
} else if (path_arr.includes('random-chat')) {
    await random_chat();
} else if (path_arr.includes('dashboard')) {
    await dashboard();
} else if (path_arr.includes('user-profile')) {
    await user_profile();
}
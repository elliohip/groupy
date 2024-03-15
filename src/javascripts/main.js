import demo from './scripts/demo';
import random_chat from './scripts/random_chat'
let path_arr = window.location.pathname.split('/');

if (path_arr.includes('demo')) {
    await demo();
} else if (path_arr.includes('random-chat')) {
    await random_chat()
} else if (path_arr.includes('dashboard')) {

}
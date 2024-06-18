import { GLOBALS } from "../globals";
import {
    render_direct_message_bars,
    render_direct_message_history,

} from "./renderers/direct_mesage_renderer"


export default async function(socket) {
    let direct_message_histories = await (await fetch(`${window.location.origin}/api/users/${USER.user_id}/direct-messages/?user_id=${USER.user_id}`)).json()
    console.log(direct_message_histories[0].messages);
    console.log(direct_message_histories[0].users)
    let other_user_id = direct_message_histories[0].users.find((val) => {
        return String(val) != USER.user_id;
    })
    console.log("other_id")
    GLOBALS.http_group_id = direct_message_histories[0]._id;
    render_direct_message_bars(direct_message_histories);
    render_direct_message_history(socket, direct_message_histories[0], other_user_id)
}
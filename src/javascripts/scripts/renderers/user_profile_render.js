export const render_friend = (friend) => {

    let it = document.createElement('li');
    let info_anchor = document.createElement('a');
    info_anchor.href = `${window.location.origin}/user-info/${friend._id}`;


    let pfp = document.createElement('img');
    let us_nm = document.createElement('p');
    let crt_grp = document.createElement('a');
    let rm_friend = document.createElement('a');

    info_anchor.classList.add('friend-profile');
    pfp.classList.add('profile-pic-list');
    rm_friend.classList.add('button', 'remove-friend');
    crt_grp.classList.add('button', 'new-group');

    us_nm.innerHTML = friend.username;
    crt_grp.innerHTML = 'new group';
    rm_friend.innerHTML = 'remove friend';

    pfp.src = `${window.location.origin}/api/users/photos/pfp-by-id/${friend._id}`;

    crt_grp.addEventListener('click', async (ev) => {
        ev.preventDefault();
        await fetch(`${window.location.origin}/api/groups/new-group?friend_id=${friend._id}`, {
            method: 'POST'
        });
    });

    rm_friend.addEventListener('click', async (ev) => {
        ev.preventDefault();
        it.parentElement.removeChild(it);
        let data = await (await fetch(`${window.location.origin}/api/users/${USER.user_id}/remove-friend-q?friend_id=${friend._id}`, {
            method: 'PUT'
        })).json();

    });

    info_anchor.addEventListener("click", async (ev) => {
        ev.preventDefault();
        if (ev.target != info_anchor) {
            return;
        }
        window.location = `${window.location.origin}/user-info/${friend._id}`;
    })

    info_anchor.append(pfp, us_nm, crt_grp, rm_friend)
    it.append(info_anchor);

    return it;
}


export const render_friend_request = (friend_request, user) => {

    let it = document.createElement('li');
    let info_anchor = document.createElement('a');
    info_anchor.href = `${window.location.origin}/user-info/${friend_request.from_id}`;
    let pfp = document.createElement('img');
    let unm = document.createElement('p');
    let acpt = document.createElement('a');
    let rjct = document.createElement('a');

    pfp.classList.add('profile-pic-list');
    info_anchor.classList.add('profile-friend-request');
    acpt.classList.add('button', 'accept-friend-request');
    rjct.classList.add('button', 'reject-friend-request');


    pfp.src = `${window.location.origin}/api/users/photos/pfp-by-id/${user._id}`;
    unm.innerHTML = user.username;
    acpt.href = `${window.location.origin}/api/friend-requests/${friend_request._id}/accept`;
    rjct.href = `${window.location.origin}/api/friend-requests/${friend_request._id}/reject`

    acpt.addEventListener('click', async (ev) => {
        ev.preventDefault();
        it.parentElement.removeChild(it);
        let accept_data = await (await fetch(`${window.location.origin}/api/friend-requests/${friend_request._id}/accept`, {
            method: 'PUT'
        })).json();
        
    });

    rjct.addEventListener('click', async (ev) => {
        ev.preventDefault();
        it.parentElement.removeChild(it);
        let reject_data = await (await fetch(`${window.location.origin}/api/friend-requests/${friend_request._id}/reject`, {
            method: 'PUT'
        })).json();
    });

    acpt.innerHTML = 'accept';
    rjct.innerHTML = 'reject';

    info_anchor.append(pfp, unm, acpt, rjct)
    it.append(info_anchor);

    return it;
}
export const render_friend = (friend) => {

    let it = document.createElement('li');
    let info_anchor = document.createElement('a');
    info_anchor.href = `${window.location.origin}/user-info/${friend._id}`;
    let pfp = document.createElement('img');
    let us_nm = document.createElement('p');
    let crt_grp = document.createElement('a');
    let rm_grp = document.createElement('a');

    info_anchor.classList.add('friend-profile');
    pfp.classList.add('profile-pic-list');
    rm_grp.classList.add('button', 'remove-friend');
    crt_grp.classList.add('button', 'new-group');

    us_nm.innerHTML = friend.username;
    crt_grp.innerHTML = 'new group';
    rm_grp.innerHTML = 'remove friend';

    pfp.src = `${window.location.origin}/api/users/photos/pfp/${friend._id}`;

    crt_grp.addEventListener('click', async (ev) => {
        await (await fetch(`${window.location.origin}/api/groups/new-group?friend_id=${friend._id}`));
        it.parentElement.removeChild(it);
    });

    rm_grp.addEventListener('click', async (ev) => {
        await (await fetch(`${window.location.origin}/api/users/remove-friend/by-query?friend_id=${friend._id}`));
        it.parentElement.removeChild(it);
    });

    info_anchor.append(pfp, us_nm, crt_grp, rm_grp)
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


    pfp.src = `${window.location.origin}/api/users/photos/pfp/${user._id}`;
    unm.innerHTML = user.username;
    acpt.href = `${window.location.origin}/api/friend-requests/${friend_request._id}/accept`;
    rjct.href = `${window.location.origin}/api/friend-requests/${friend_request._id}/reject`

    acpt.addEventListener('click', async (ev) => {
        ev.preventDefault();
        let accept_data = await (await fetch(`${window.location.origin}/api/friend-requests/${friend_request._id}/accept`, {
            method: 'PUT'
        }).json());
        it.parentElement.removeChild(it);
    });

    rjct.addEventListener('click', async (ev) => {
        ev.preventDefault();
        let reject_data = await (await fetch(`${window.location.origin}/api/friend-requests/${friend_request._id}/reject`, {
            method: 'PUT'
        }).json());
        it.parentElement.removeChild(it);
    });

    acpt.innerHTML = 'accept';
    rjct.innerHTML = 'reject';

    info_anchor.append(pfp, unm, acpt, rjct)
    it.append(info_anchor);

    return it;
}
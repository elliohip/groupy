"use strict";(self.webpackChunksrc=self.webpackChunksrc||[]).push([[660],{660:(e,t,n)=>{n.r(t),n.d(t,{render_chat_bar:()=>l,render_group_chat:()=>o}),n(177);var s=n(715),a=n(550);const r=(e,t,n)=>{let s=document.createElement("div"),a=document.createElement("p"),r=document.createElement("img"),o=document.createElement("div");o.classList.add("message-user-info");let i=document.createElement("small");return i.innerHTML=t.username,r.classList.add("message-pfp"),r.src=`/api/users/photos/pfp-by-id/${t.user_id}`,o.append(r,i),s.classList.add("message",e),a.classList.add("message-text",e),a.innerHTML=n.value,s.append(o,a),s};async function o(e,t,n){let o=document.getElementById("main-display");o.innerHTML="",o.innerHTML='\n        <div id="groupchat-actions" class="button gc-actions-button">\n            groupchat actions\n        </div>\n        <div id="message-alert-box">\n\n        </div>\n        <div id="message-history">\n\n        </div>\n        <div id="typing-info">\n          \n        </div>\n        <form id="message-bar">\n            <input placeholder="enter message" type="text" id="message-input">\n            <input type="submit" value="send" id="send-message-btn" class="button">\n        </form>\n    \n    ',o.querySelector("#groupchat-actions").addEventListener("click",(t=>{(0,a.o$)(e,s.U.http_group_id,{x:t.clientX,y:t.clientY},n)}));let i=`group-${t}`,l=await(await fetch(`${window.location.origin}/api/messages/${t}/?current_time=${Date.now()}`)).json(),d=document.getElementById("message-history"),u=document.getElementById("send-message-btn"),c=(document.getElementById("typing-info"),document.getElementById("message-alert-box")),m=(document.getElementById("message-bar"),document.getElementById("message-input")),g=[];for(let e=l.length-1;e>0;e--){let t="";t=l[e].user_id==USER.user_id?"client":"other",g.push(r(t,{user_id:l[e].user_id,username:l[e].username},{value:l[e].text}))}document.getElementById("message-history").children[1]?g.length>0&&d.children[0].before(...g.reverse()):g.length>0&&(d.appendChild(g[0]),g[0].after(...g.slice(1))),e.on("connect",(()=>{e.emit("join-group",i)})),e.connected&&e.emit("join-group",i),e.on("message-from-group",((e,n)=>{if(console.log(`\n            room_id: room-${e}\n            http_room_id: room-${t}\n            `),e==s.U.http_group_id){let t=r("other",{user_id:n.user_id,username:n.username},{value:n.text});d.insertBefore(t,d.firstChild);let s=document.querySelector(`#group-${e} small.current-message`);console.log(`${n.username}: ${n.text}`),s.innerHTML=`${n.username}: ${n.text}`}else{console.log(e);let t=document.querySelector(`#group-${e} small.current-message`);console.log(`${n.username}: ${n.text}`),t.innerHTML=`${n.username}: ${n.text}`}})),window.addEventListener("beforeunload",(t=>(t.preventDefault(),e.emit("user-left",i),t.returnValue=!0,!0))),e.on("user-joined",(e=>{let t=document.createElement("h1");t.classList.add("user-join-flash"),t.innerHTML="user  joined.",c.appendChild(t),setTimeout((()=>{document.querySelectorAll(".user-join-flash").forEach((e=>{c.removeChild(e)}))}),5e3)})),u.addEventListener("click",(async n=>{n.preventDefault(),m.value.length>500&&alert("messages can only be 500 chars long"),console.log(USER.username);let s=new FormData;s.append("text",m.value),await fetch(`${window.location.origin}/api/messages/${t}/text-messages?text=${m.value}&username=${USER.username}`,{method:"POST",body:s}),e.emit("message-to-group",i,{user_id:USER.user_id,username:USER.username,text:m.value});let a=r("client",{user_id:USER.user_id,username:USER.username},{value:m.value});d.insertBefore(a,d.firstChild),m.value=""}))}async function i(e){let t=await(await fetch(`${window.location.origin}/api/messages/${e._id}/latest-msg`)).json();console.log(t);let n=document.createElement("li");n.id=`group-${e._id}`;let s=document.createElement("img");s.classList.add("group-img"),s.src=`${window.location.origin}/api/groups/group-photo-default`,n.appendChild(s);let a=document.createElement("p");a.classList.add("group-name"),a.innerHTML=e.group_name;let r=document.createElement("small");return r.classList.add("current-message"),r.innerHTML=t.text,n.append(a,r),n.classList.add("group-chat"),n}async function l(e,t){let n=document.getElementById("chats-list");n.innerHTML="";let s=[];0==t.length&&(n.innerHTML="no groups");for(let e=0;e<t.length;e++){let a=await i(t[e]);n.appendChild(a),console.log(t[e]._id),s.push(a)}return s}}}]);
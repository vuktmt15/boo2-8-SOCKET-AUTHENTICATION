const socket = io();
const form = document.querySelector("form");
const input = document.querySelector("input.message");
const dataUser = document.querySelector(".data-user");
const dataFriend = document.querySelector(".data-friend");
const listMessages = document.querySelector("ul.list-messages");

// listMessages.scrollIntoView({
//   behavior: "smooth",
//   block: "end",
//   inline: "end",
// });

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const avatarSender = dataUser.getAttribute("data-avatar");
  const liEle = document.createElement("li");
  liEle.className = "msg-right";
  liEle.innerHTML = `
    <div class="msg-left-sub">
        <img src="${avatarSender}" />
        <div class="msg-desc">
        ${input.value}
        </div>
        <small>05:25 am</small>
    </div>
  `;
  if (input.value) {
    listMessages.appendChild(liEle);
    socket.emit("send message", {
      content: input.value,
      sender: dataUser.getAttribute("data-id"),
      receiver: dataFriend.getAttribute("data-id"),
    });

    input.value = "";
  }
});

socket.on("send message", (data) => {
  if (
    data.receiver.toString() === dataUser.getAttribute("data-id").toString() &&
    data.sender.toString() === dataFriend.getAttribute("data-id").toString()
  ) {
    const avatarSender = dataFriend.getAttribute("data-avatar");
    const liEle = document.createElement("li");
    liEle.className = "msg-left";
    liEle.innerHTML = `
    <div class="msg-left-sub">
        <img src="${avatarSender}" />
        <div class="msg-desc">
        ${data.content}
        </div>
        <small>05:25 am</small>
    </div>
    `;
    listMessages.appendChild(liEle);
  }
});

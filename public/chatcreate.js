function loadCSS(filename) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = filename;
    link.media = 'all';

    // Append the link element to the <head>
    document.getElementsByTagName('head')[0].appendChild(link);
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM is loded");
    await getUserChat();
    await dislayChat();
    loadCSS('https://100.135.33.73/css-file-for-chatcreate.css');
})

// // chat.js
let chatData = {};
let selectedChat = [];
let chatDataRef = {};
const chatButton = renderChatButton();
const chatWindow = renderChatBox();
let open = false;
console.log("Cookie is saves like :", document.cookie)
const getUserChat = async () => {
    console.log("js file liading")
    let response = await fetch('https://100.135.33.73/userchat', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        credentials: 'include',
    });

    if (response.ok) {
        let userChatData = await response.json();
        console.log("Getting Chat Data from Server : ", userChatData);
        chatDataRef = { ...userChatData };
        chatData = Object.keys(userChatData).length === 0 ? {} : userChatData;
    }
};

function renderChatBox() {
    // Create and toggle the chat box
    const chatBox = document.createElement('div');
    chatBox.classList.add('chat-box');
    chatBox.style.position = 'fixed';
    chatBox.style.bottom = '0';
    chatBox.style.right = '0';
    chatBox.style.width = '300px';
    chatBox.style.height = '500px';
    chatBox.style.backgroundColor = 'white';
    chatBox.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.3)';
    chatBox.style.zIndex = '9999';

    // Chat top bar
    const topBar = document.createElement('div');
    topBar.classList.add('chat-top-bar');
    topBar.style.backgroundColor = 'pink';
    topBar.style.padding = '10px';
    topBar.style.cursor = 'pointer';
    topBar.innerText = 'How can I help you?';
    topBar.onclick = toggleChat;
    chatBox.appendChild(topBar);

    // Chat area
    const chatArea = document.createElement('div');
    chatArea.classList.add('chat-area');
    chatArea.style.height = 'calc(100% - 80px)';
    chatArea.style.overflowY = 'scroll';
    chatBox.appendChild(chatArea);

    // Text area and send button
    const textAreaContainer = document.createElement('div');
    textAreaContainer.classList.add('text-area');
    const textArea = document.createElement('textarea');
    textArea.name = 'chatarea';
    textArea.classList.add('text-area');
    const sendButton = document.createElement('button');
    sendButton.classList.add('send-button');
    sendButton.innerText = 'Send';
    sendButton.onclick = handleSend;
    textAreaContainer.appendChild(textArea);
    textAreaContainer.appendChild(sendButton);
    chatBox.appendChild(textAreaContainer);

    // Append chat box to the document
    return chatBox;
    // document.body.appendChild(chatBox);
}

function renderChatButton() {
    // Create a small toggle button for the chat
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('chat-toggle-button');
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.width = '50px';
    toggleButton.style.height = '50px';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.backgroundColor = 'pink';
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '9999';
    toggleButton.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="none"/>
            <text x="12" y="16" text-anchor="middle" font-size="14" fill="black">?</text>
          </svg>
        `;
    toggleButton.addEventListener('click', toggleChat);
    return toggleButton;
}
function handleClick(chat) {
    if (Object.keys(chatData[chat]).length > 0) {
        chatData = chatData[chat];
        selectedChat.push(chat);
        updateChatView();
    }
}

function handleBackButton() {
    if (selectedChat.length === 0) {
        alert("This is the first page");
    } else {
        selectedChat.pop();
        let tempChat = { ...chatDataRef };
        selectedChat.forEach(chat => {
            tempChat = tempChat[chat];
        });
        chatData = tempChat;
        updateChatView();
    }
}

function handleSend() {
    // Add your logic for handling message sending
    console.log("Message sent!");
}

function updateChatView() {
    const chatArea = document.querySelector('.chat-area');
    chatArea.innerHTML = ''; // Clear previous chat options
    Object.keys(chatData).forEach(chat => {
        const chatOption = document.createElement('div');
        chatOption.classList.add('chat-option');
        chatOption.innerText = chat;
        chatOption.onclick = () => handleClick(chat);
        chatArea.appendChild(chatOption);
    });
    addBackButton();
}

function toggleChat() {
    if (open) {
        const chatBox = document.querySelector('.chat-box');
        chatBox.remove();
        document.body.appendChild(chatButton);
    } else {
        const chatBtn = document.querySelector('.chat-toggle-button');
        chatBtn.remove();
        console.log("Is Type of Node :", chatWindow);
        document.body.appendChild(chatWindow)
        addChatToChatArea();
    }
    console.log("Before Opent", open)
    open = open ? false : true;
    console.log("is Opent", open)
}

async function dislayChat() {
    document.body.appendChild(open ? chatWindow : chatButton);
}

function addChatToChatArea() {
    console.log("chatData here where assigning it to the chatbox", chatData);
    const chatArea = document.querySelector('.chat-area');
    console.log(chatArea.childNodes)
    if (chatArea.childNodes.length === 0) {
        Object.keys(chatData).forEach(chat => {
            const chatOption = document.createElement('div');
            chatOption.classList.add('chat-option');
            chatOption.innerText = chat;
            chatOption.onclick = () => handleClick(chat);
            chatArea.appendChild(chatOption);
        });
    }
    addBackButton();
}

function addBackButton() {
    const chatArea = document.querySelector('.chat-area');
    const backbtn = document.createElement('div');
    backbtn.classList.add('back-btn');
    backbtn.innerText = "Go To Bach Menue";
    backbtn.style.padding = '5px';
    backbtn.style.fontWeight = '500';
    backbtn.addEventListener('click', handleBackButton);
    if (selectedChat.length > 0) {
        chatArea.appendChild(backbtn);
    }
}
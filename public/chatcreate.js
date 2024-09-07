document.addEventListener('DOMContentLoaded', () => {
    console.log("Testing...");
    let newBox = document.createElement('div');
    newBox.style.width = '100px';
    newBox.style.height = '50px';
    newBox.style.backgroundColor = 'black';
    console.log("Testing...", newBox);
    document.body.appendChild(newBox);
})

// // chat.js
// let chatData = {};
// let selectedChat = [];
// let chatDataRef = {};
// const chatButton = renderChatButton();
// const chatWindow = renderChatBox();
// let open = false;

// const getUserChat = async () => {
//     let response = await fetch('http://localhost:3001/userchat', {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         method: "POST",
//         body: JSON.stringify({ 'user': sessionStorage.getItem('user') }),
//         credentials: 'include',
//     });

//     if (response.ok) {
//         let userChatData = await response.json();
//         chatDataRef = { ...userChatData };
//         chatData = Object.keys(userChatData).length === 0 ? {} : userChatData;
//         console.log("Getting Chat Data from Server : ", chatData)
//     }
// };

// function renderChatBox() {
//     // Create and toggle the chat box
//     const chatBox = document.createElement('div');
//     chatBox.className = 'chat-box open';
//     chatBox.style.position = 'fixed';
//     chatBox.style.bottom = '0';
//     chatBox.style.right = '0';
//     chatBox.style.width = '300px';
//     chatBox.style.height = '500px';
//     chatBox.style.backgroundColor = 'white';
//     chatBox.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.3)';
//     chatBox.style.zIndex = '9999';

//     // Chat top bar
//     const topBar = document.createElement('div');
//     topBar.className = 'chat-top-bar';
//     topBar.style.backgroundColor = 'pink';
//     topBar.style.padding = '10px';
//     topBar.style.cursor = 'pointer';
//     topBar.innerText = 'How can I help you?';
//     topBar.onclick = toggleChat;
//     chatBox.appendChild(topBar);

//     // Chat area
//     const chatArea = document.createElement('div');
//     chatArea.className = 'chat-area';
//     chatArea.style.height = 'calc(100% - 80px)';
//     chatArea.style.overflowY = 'scroll';
//     chatBox.appendChild(chatArea);
//     Object.keys(chatData).forEach(chat => {
//         const chatOption = document.createElement('div');
//         chatOption.className = 'chat-option';
//         chatOption.innerText = chat;
//         chatOption.onclick = () => handleClick(chat);
//         chatArea.appendChild(chatOption);
//     });

//     // Text area and send button
//     const textAreaContainer = document.createElement('div');
//     textAreaContainer.className = 'text-area';
//     const textArea = document.createElement('textarea');
//     textArea.name = 'chatarea';
//     textArea.className = 'text-area';
//     const sendButton = document.createElement('button');
//     sendButton.className = 'send-button';
//     sendButton.innerText = 'Send';
//     sendButton.onclick = handleSend;
//     textAreaContainer.appendChild(textArea);
//     textAreaContainer.appendChild(sendButton);
//     chatBox.appendChild(textAreaContainer);

//     // Append chat box to the document
//     return chatBox;
//     // document.body.appendChild(chatBox);
// }

// function renderChatButton() {
//     // Create a small toggle button for the chat
//     const toggleButton = document.createElement('button');
//     toggleButton.className = 'chat-toggle-button';
//     toggleButton.style.position = 'fixed';
//     toggleButton.style.bottom = '20px';
//     toggleButton.style.right = '20px';
//     toggleButton.style.width = '50px';
//     toggleButton.style.height = '50px';
//     toggleButton.style.borderRadius = '50%';
//     toggleButton.style.backgroundColor = 'pink';
//     toggleButton.style.border = 'none';
//     toggleButton.style.cursor = 'pointer';
//     toggleButton.style.zIndex = '9999';
//     toggleButton.innerHTML = `
//           <svg width="24" height="24" viewBox="0 0 24 24">
//             <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="none"/>
//             <text x="12" y="16" text-anchor="middle" font-size="14" fill="black">?</text>
//           </svg>
//         `;
//     toggleButton.addEventListener('click', toggleChat);
//     return toggleButton;
// }
// function handleClick(chat) {
//     if (Object.keys(chatData[chat]).length > 0) {
//         chatData = chatData[chat];
//         selectedChat.push(chat);
//         updateChatView();
//     }
// }

// function handleBackButton() {
//     if (selectedChat.length === 0) {
//         alert("This is the first page");
//     } else {
//         selectedChat.pop();
//         let tempChat = { ...chatDataRef };
//         selectedChat.forEach(chat => {
//             tempChat = tempChat[chat];
//         });
//         chatData = tempChat;
//         updateChatView();
//     }
// }

// function handleSend() {
//     // Add your logic for handling message sending
//     console.log("Message sent!");
// }

// function updateChatView() {
//     const chatArea = document.querySelector('.chat-area');
//     chatArea.innerHTML = ''; // Clear previous chat options
//     Object.keys(chatData).forEach(chat => {
//         const chatOption = document.createElement('div');
//         chatOption.className = 'chat-option';
//         chatOption.innerText = chat;
//         chatOption.onclick = () => handleClick(chat);
//         chatArea.appendChild(chatOption);
//     });
// }

// function toggleChat() {
//     const chatBox = document.querySelector('.chat-box');
//     open = open ? false : true;
//     document.body.appendChild(open ? chatWindow : chatButton);
// }

// document.addEventListener('DOMContentLoaded', loadChat);
// async function loadChat() {
//     console.log("This is loading the chat");
//     await getUserChat();
//     console.log(chatWindow);
//     console.log('document.body : ', document.body);
//     document.body.appendChild(open ? chatWindow : chatButton);
//     console.log('document.body : ', document.body);
// }


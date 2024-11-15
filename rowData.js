let data = [
    {
        "_id": "672f84658afb5cc2c75b7841",
        "user": "86cf86d4bee629728f42a8ea",
        "from": "Some client",
        "chat": [
            {
                "from": "Some Client", "chat": "This is First chat"
            },
            {
                "from": "Admin User", "chat": "Admin Replied"
            },
            {
                "from": "Some Client", "chat": "Thanku for helping me out"
            }, {
                "from": "Admin User", "chat": "I am always here to help you"
            }, {
                "from": "Some Client", "chat": "I am glad to use your application"
            }, {
                "from": "Admin USer", "chat": "Please feel free to connect me thanks!"
            }
        ]
    },

    {
        "_id": "672f85b86a1eca9649db655sdb",
        "user": "86cf86sd4bee629728f42aasd8ea",
        "from": "Some client",
        "chat": [
            {
                "from": "Some Client", "chat": "This is First chat"
            },
            {
                "from": "Admin User", "chat": "Admin Replied"
            },
            {
                "from": "Some Client", "chat": "Thanku for helping me out"
            }, {
                "from": "Admin User", "chat": "I am always here to help you"
            }, {
                "from": "Some Client", "chat": "I am glad to use your application"
            }, {
                "from": "Admin USer", "chat": "Please feel free to connect me thanks!"
            }
        ]
    },
    {
        "_id": "672f8868854cb1dbe35fd7b4",
        "user": "86cf86d4bee62f9728f42a8ea",
        "from": "Some client2",
        "chat": []
    },
    {
        "_id": "67319b93044b814d428337e5",
        "user": "86cf86d4bee629728f42a8ea",
        "from": "Some client",
        "chat": []
    },
    {
        "_id": "67319bd17262a5a9184b1895",
        "user": "86cf86d4bee629728f42a8ea",
        "from": "Some client",
        "chat": [
            {
                "from": "Some Client", "chat": "This is First chat"
            },
            {
                "from": "Admin User", "chat": "Admin Replied"
            },
        ]
    },
    {
        "_id": "67319bf07262a5a9184b1896",
        "user": "86cf86d4bee629728f42a8ea",
        "from": "Some client",
        "chat": [
            {
                "from": "Some Client", "chat": "This is First chat"
            },
            {
                "from": "Admin User", "chat": "Admin Replied"
            },
        ]
    }
]

// function checkIfChatAlreadyExists(obj, chatWindowData) {
//     return chatWindowData.some(existingObj => existingObj.user === obj.user && existingObj.from === obj.from);
// }
// let obj2 = {
//     "user": "86cf86d4bee62f9728f42a8ea",
//     "from": "Some client"
// }
// console.log(checkIfChatAlreadyExists(obj2, data));


function checkIfChatAlreadyExists(chatWindowData) {
    let ret = false;
    chatWindowData.some((existingObj) => {
        if (existingObj.from === "Some client2") {
            console.log(typeof existingObj.chat);
            // existingObj.chat.push("somthing added")
            existingObj.chat.push({ user: 'this is yser', from: "this si frm", chat: "this is cat" });
            ret = existingObj.chat;
        }
    });
    return ret;
}




console.log(checkIfChatAlreadyExists(data));
setTimeout(() => { console.log("Changed Dyta : ") }, 1000);

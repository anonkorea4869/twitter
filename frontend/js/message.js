// Initialize an object to store messages for each user
const chatMessagesByUser = {};
function navigateToIndex() {
    window.location.href = 'index.html';
}
function openChat(username) {
    // Show the chat window
    document.getElementById('chatWindow').style.display = 'flex';

    // Load chat history, user details, etc.
    document.getElementById('chatUsername').innerText = username;

    // For simplicity, load messages from the object or create an empty array
    const messages = chatMessagesByUser[username] || [];

    // Display the messages in the chat window
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = messages.map(message => `<p>${message}</p>`).join('');

    // Update the dataset with the current username
    document.getElementById('chatWindow').dataset.username = username;

}

function closeChat() {
    // Hide the chat window
    document.getElementById('chatWindow').style.display = 'none';
}

function sendMessage() {
    // Get the input value and username
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    const username = document.getElementById('chatWindow').dataset.username;

    // For simplicity, let's just log the message for now
    console.log(`Sending message to ${username}: ${message}`);

    // Store the message in the object for the current user
    if (!chatMessagesByUser[username]) {
        chatMessagesByUser[username] = [];
    }
    chatMessagesByUser[username].push(`You: ${message}`);

    // Display the updated messages in the chat window
    // openChat(username);

    // Clear the input field
    messageInput.value = '';
}
// function sendToServer(username, message) {
//     fetch('/api/sendMessage', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             username: username,
//             message: message,
//         }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         // Handle success response from the server, if needed
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         // Handle error from the server, if needed
//     });
// }
function createNewChat() {
    const newUsername = prompt("Enter the nickname for the new chat:");

    if (newUsername) {
        // Create a new chat list item dynamically
        const chatList = document.querySelector('.chatList');
        const newChatListItem = document.createElement('div');
        newChatListItem.className = 'chatListItem';
        newChatListItem.innerHTML = `
            <img src="default-user-image.jpg" alt="">
            <div class="chatInfo">
                <h3>${newUsername}</h3>
                <p>No messages yet</p>
            </div>
        `;
        newChatListItem.onclick = function () {
            openChat(newUsername);
        };

        // Add the new chat list item to the chat list
        chatList.appendChild(newChatListItem);

        // Open the new chat window
        openChat(newUsername);
    }
}

document.getElementById('messageInput').addEventListener('keydown', function(event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.key === 'Enter') {
        // Prevent the default action (form submission, line break, etc.)
        event.preventDefault();
        // Execute the sendMessage function
        sendMessage();
    }
});
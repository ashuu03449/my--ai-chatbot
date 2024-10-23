let prompt = document.querySelector('#prompt');
let chat_container = document.querySelector('.chat-container');
let imgbtn = document.getElementById('imgbtn');
let imgfileinput = document.querySelector("#imgbtn input"); 
let svgimg = document.querySelector("#imgbtn img"); 
let submitbtn = document.querySelector('#submit img');
let submit = document.querySelector('#submit');
const Api_Url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBUntQzv8mc-oXotaTQMxX9PeU5Cm_asHM';

// User message and file data structure
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

// Adjust height of the input area based on content
prompt.addEventListener('input', function () {
    this.style.height = 'auto'; // Reset height
    this.style.height = `${this.scrollHeight}px`; // Set to scroll height
});

// Generate AI response based on user input
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector('.ai-chatarea');

    // Prepare request options
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [
                { "parts": [{ "text": user.message }, (user.file.data ? [{ "inline_data": user.file }] : [])] }
            ]
        })
    };

    try {
        let response = await fetch(Api_Url, RequestOption);
        let data = await response.json();
        // Clean up the API response text
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        text.innerHTML = apiResponse;

    } catch (error) {
        console.log(error); // Log errors

    } finally {
        // Scroll to the bottom of chat
        chat_container.scrollTo({ top: chat_container.scrollHeight, behavior: "smooth" });
        svgimg.src = `img.svg`; // Reset image
        svgimg.classList.remove('choose'); // Remove selected class
        user.file = {}; // Reset file data
    }
}

// Create chatbox element
function createChatBox(html, classes) {
    let div = document.createElement('div');
    div.innerHTML = html; // Set HTML content
    div.classList.add(classes); // Add classes
    return div;
}

// Handle user's chat response
function handleChatResponse(message) {
    user.message = message.replace(/\n/g, '<br>'); // Format new lines
    let html = `<img src="./userrem.png" alt="user" width="8%" id="userimg">
    <div class="user-chatarea">
    ${user.message}
    ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
    </div>`;
    
    prompt.value = ""; // Clear input
    let userChatBox = createChatBox(html, 'user-chatbox'); // Create user chat box
    chat_container.appendChild(userChatBox); // Append to chat
    chat_container.scrollTo({ top: chat_container.scrollHeight, behavior: "smooth" }); // Scroll to bottom

    // Simulate AI typing with a delay
    setTimeout(() => {
        let html = `<img src="./gicon.png" alt="" width="10%" id="aiimg">
        <div class="ai-chatarea">
        <div class="loader">
          <div class="bubble"></div>
          <div class="bubble"></div>
          <div class="bubble"></div>
        </div>
        </div>`;
        
        let aiChatBox = createChatBox(html, "ai-chatbox"); // Create AI chat box
        chat_container.appendChild(aiChatBox); // Append to chat
        generateResponse(aiChatBox); // Generate response
    }, 600);
}

// Event listeners for user input
prompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // On 'Enter' key
        e.preventDefault(); // Prevent default action
        handleChatResponse(prompt.value); // Handle response
    }
});

// Reset height and padding
prompt.addEventListener('input', function () {
    this.style.height = '70px'; // Reset height
    this.style.padding = "20px"; // Adjust padding
});

// Submit button click event

submitbtn.addEventListener('click', () => {
    handleChatResponse(prompt.value); // Handle response
});

// Handle image file input
imgfileinput.addEventListener('change', () => {
    const file = imgfileinput.files[0]; // Get selected file
    if (!file) return; // Exit if no file
    
    let reader = new FileReader(); // Create file reader
    reader.onload = (e) => {
        let base64str = e.target.result.split(',')[1]; // Extract base64 string
        user.file = {
            mime_type: file.type, // Set MIME type
            data: base64str // Set file data
        };
        svgimg.src = `data:${user.file.mime_type};base64,${user.file.data}`; // Update image
        svgimg.classList.add('choose'); // Mark image as chosen
    };
    reader.readAsDataURL(file); // Read file as data URL
});

// Trigger file input on button click
imgbtn.addEventListener('click', () => {
    imgbtn.querySelector("input").click(); // Open file dialog
});

// Show welcome message on page load
function showWelcomeMessage() {
    let html = `<img src="./gicon.png" alt="" width="10%" id="aiimg">
    <div class="ai-chatarea animate__animated animate__bounceInLeft">
        👋 Welcome to the Chatbot! This chatbot was created by Ayesha Shakoor😉.
    </div>`;
    
    let aiChatBox = createChatBox(html, "ai-chatbox"); // Create welcome box
    chat_container.appendChild(aiChatBox); // Append to chat
}

// Show the welcome message when the page loads
window.onload = showWelcomeMessage;

// Theme selection functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeSelector = document.getElementById('theme');
    
    // Set initial theme from local storage
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(currentTheme); // Apply theme
    themeSelector.value = currentTheme; // Set selector value

    // Listen for theme changes
    themeSelector.addEventListener('change', function() {
        document.body.classList.remove('light', 'dark'); // Remove both themes
        const selectedTheme = themeSelector.value; // Get selected theme
        document.body.classList.add(selectedTheme); // Apply selected theme

        // Save user's theme preference
        localStorage.setItem('theme', selectedTheme); // Store in local storage
    });
});

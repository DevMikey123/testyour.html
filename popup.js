// Function to detect if the user is on a mobile device
function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Function to close the popup
function closePopup() {
    document.getElementById('mobilePopup').style.display = 'none';
}

// Function to inject CSS for the popup
function injectPopupStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        .popup {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }
        .popup-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            width: 80%;
            max-width: 400px;
            text-align: center;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

// Function to inject the popup HTML
function injectPopupHTML() {
    const popupHTML = `
        <div id="mobilePopup" class="popup">
            <div class="popup-content">
                <span class="close-btn" onclick="closePopup()">&times;</span>
                <p>This website is not optimized for mobile phones. Please visit us on a desktop for the best experience.</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

// Initialize the popup on document ready
document.addEventListener('DOMContentLoaded', function() {
    injectPopupStyles();
    injectPopupHTML();
    if (isMobile()) {
        document.getElementById('mobilePopup').style.display = 'block';
    }
});

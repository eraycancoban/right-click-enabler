document.addEventListener('contextmenu', function(event) {
    event.stopPropagation();
}, true);

document.addEventListener('mousedown', function(event) {
    if (event.button === 2) { // Right mouse button
        event.preventDefault();
        const contextMenuEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        event.target.dispatchEvent(contextMenuEvent);
    }
});

// Enable text selection functionality
function enableTextSelection() {
    // Override CSS user-select property to allow selection
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            user-select: auto !important;
            -webkit-user-select: auto !important;
            -moz-user-select: auto !important;
            -ms-user-select: auto !important;
        }
    `;
    document.head.appendChild(style);
    
    // Prevent sites from cancelling selection events
    document.addEventListener('selectstart', function(e) {
        e.stopPropagation();
    }, true);
    
    // Remove existing selection event handlers
    document.onselectstart = null;
    document.body.onselectstart = null;
    
    // Prevent any script from registering selection blockers
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        el.onselectstart = null;
    });
    
    console.log("Text selection has been enabled on this page");
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "enableRightClick") {
        // Additional code to ensure right-click is enabled on this specific page
        document.addEventListener('contextmenu', function(e) {
            e.stopImmediatePropagation();
            return true;
        }, true);
        
        // Remove potential event listeners that might block right-click
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            el.oncontextmenu = null;
        });
        
        // Also enable text selection
        enableTextSelection();
        
        console.log("Right-click and text selection have been enabled on this page");
    }
});

// Prevent drag start event prevention which often blocks selection
document.addEventListener('dragstart', function(event) {
    event.stopPropagation();
}, true);

// Override global event handlers that might disable right click
window.addEventListener('load', function() {
    // Disable common right-click blocking methods
    document.oncontextmenu = null;
    document.onmousedown = null;
    document.onmouseup = null;
    document.body.oncontextmenu = null;
    document.body.onmousedown = null;
    document.body.onmouseup = null;
    
    // Call the text selection enabler
    enableTextSelection();
});

// Override selection-related methods
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'contextmenu' || type === 'mousedown' || type === 'mouseup' || 
        type === 'selectstart' || type === 'select' || type === 'copy' || 
        type === 'dragstart') {
        // Don't add event listeners that might block right-click or text selection
        return;
    }
    originalAddEventListener.call(this, type, listener, options);
};
// content.js - Handles text insertion in web pages

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'insert') {
        insertText(request.content);
        sendResponse({ success: true });
    }
    return true;
});

function insertText(text) {
    const activeElement = document.activeElement;
    
    // Check if we're in an input field
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        insertIntoInput(activeElement, text);
    } 
    // Check if we're in a contenteditable element
    else if (activeElement.contentEditable === 'true') {
        insertIntoContentEditable(activeElement, text);
    }
    // Try to find any focused input/textarea on the page
    else {
        const inputs = document.querySelectorAll('input:focus, textarea:focus, [contenteditable="true"]:focus');
        if (inputs.length > 0) {
            const element = inputs[0];
            if (element.contentEditable === 'true') {
                insertIntoContentEditable(element, text);
            } else {
                insertIntoInput(element, text);
            }
        } else {
            // Try common selectors for compose areas
            tryCommonSelectors(text);
        }
    }
}

function insertIntoInput(element, text) {
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const value = element.value;
    
    // Insert text at cursor position
    element.value = value.substring(0, start) + text + value.substring(end);
    
    // Move cursor to end of inserted text
    element.selectionStart = element.selectionEnd = start + text.length;
    
    // Trigger input event for frameworks like React
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

function insertIntoContentEditable(element, text) {
    // Focus the element
    element.focus();
    
    // Get current selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Delete any selected text
    range.deleteContents();
    
    // Create text node with our content
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Move cursor to end of inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    element.dispatchEvent(new Event('input', { bubbles: true }));
}

function tryCommonSelectors(text) {
    // Common selectors for various websites
    const selectors = [
        // Gmail
        'div[role="textbox"][aria-label*="Message Body"]',
        'div[role="textbox"][g_editable="true"]',
        // LinkedIn
        'div[role="textbox"][contenteditable="true"]',
        '.msg-form__contenteditable',
        // Facebook
        'div[role="textbox"][contenteditable="true"][aria-label*="Write"]',
        // Twitter
        'div[role="textbox"][data-testid="tweetTextarea_0"]',
        // Slack
        'div[role="textbox"][contenteditable="true"][data-qa="message_input"]',
        // Generic
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]'
    ];
    
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && isVisible(element)) {
            element.focus();
            
            if (element.contentEditable === 'true') {
                insertIntoContentEditable(element, text);
            } else {
                insertIntoInput(element, text);
            }
            break;
        }
    }
}

function isVisible(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return rect.width > 0 && 
           rect.height > 0 && 
           style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
}

// Listen for keyboard shortcut from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'open-popup') {
        // We can't directly open the popup from content script,
        // but we can notify the user
        showNotification();
    }
});

function showNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4a90e2;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = 'Press Ctrl+Shift+R to open QuickResponse';
    
    document.body.appendChild(notification);
    
    setTimeout(() =>
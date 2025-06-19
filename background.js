// background.js - Service worker for Chrome extension

// Handle keyboard shortcut command
chrome.commands.onCommand.addListener((command) => {
    if (command === 'open-quick-response') {
        chrome.action.openPopup();
    }
});

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    // Set default responses if none exist
    chrome.storage.local.get(['responses'], (result) => {
        if (!result.responses) {
            const defaultResponses = [
                {
                    id: Date.now() + 1,
                    title: "Welcome Email",
                    content: "Hi {{name}},\n\nWelcome to our service! We're excited to have you on board. If you have any questions, don't hesitate to reach out.\n\nBest regards,\n{{your_name}}",
                    tags: ["email", "welcome"],
                    usage: 0
                },
                {
                    id: Date.now() + 2,
                    title: "Support Ticket Reply",
                    content: "Thank you for contacting support. I understand you're experiencing issues with {{issue}}. Let me help you resolve this.\n\nCould you please provide more details about when this started happening?",
                    tags: ["support", "email"],
                    usage: 0
                },
                {
                    id: Date.now() + 3,
                    title: "Meeting Follow-up",
                    content: "Hi {{name}},\n\nThank you for taking the time to meet with me on {{date}}. As discussed, here are the next steps:\n\n1. {{action1}}\n2. {{action2}}\n\nLooking forward to our continued collaboration!",
                    tags: ["email", "followup"],
                    usage: 0
                }
            ];
            chrome.storage.local.set({ responses: defaultResponses });
        }
    });
    
    // Create context menu
    chrome.contextMenus.create({
        id: "quick-response",
        title: "Insert Quick Response",
        contexts: ["editable"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "quick-response") {
        chrome.action.openPopup();
    }
});

// Optional: Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'get-active-tab') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse({ tab: tabs[0] });
        });
        return true;
    }
});
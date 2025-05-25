// This file contains the background script for the extension. It listens for events and manages the overall functionality of the extension, including enabling right-click context menus.

chrome.runtime.onInstalled.addListener(() => {
    console.log("Right Click Enabler Extension Installed");
    
    // Create context menu items only when the extension is installed
    chrome.contextMenus.create({
        id: "enableRightClick",
        title: "Enable Right Click",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        id: "enableTextSelection",
        title: "Enable Text Selection",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        id: "enableAll",
        title: "Enable All Features",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "enableRightClick" || 
        info.menuItemId === "enableTextSelection" || 
        info.menuItemId === "enableAll") {
        
        chrome.tabs.sendMessage(tab.id, { action: info.menuItemId });
    }
});

// Updated message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "enableRightClick" || 
        message.action === "enableTextSelection" || 
        message.action === "enableAll") {
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: message.action });
            sendResponse({success: true});
        });
        return true; // Keep the message channel open for the async response
    }
});
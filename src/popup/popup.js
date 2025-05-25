document.addEventListener('DOMContentLoaded', function() {
    const enableRightClickButton = document.getElementById('enable-right-click');
    const enableTextSelectionButton = document.getElementById('enable-text-selection');
    const enableAllButton = document.getElementById('enable-all');

    enableRightClickButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'enableRightClick' }, function(response) {
            if (response.success) {
                alert('Right-click has been enabled on the current page.');
            } else {
                alert('Failed to enable right-click. Please try again.');
            }
        });
    });
    
    enableTextSelectionButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'enableTextSelection' }, function(response) {
            if (response.success) {
                alert('Text selection has been enabled on the current page.');
            } else {
                alert('Failed to enable text selection. Please try again.');
            }
        });
    });
    
    enableAllButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'enableAll' }, function(response) {
            if (response.success) {
                alert('All features have been enabled on the current page.');
            } else {
                alert('Failed to enable features. Please try again.');
            }
        });
    });
});


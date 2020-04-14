chrome.browserAction.onClicked.addListener(function() {
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
         chrome.tabs.sendMessage(tabs[0].id, {hightlight:true}, function(response) {
             //console.log(response);
         });
    });
});

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
                temp = message.count;
                chrome.browserAction.setBadgeText({text: temp.toString()});
                chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        }
);
function activateLock(setTitle, tabID) {
  setTitle = escapeInput(setTitle)
	chrome.tabs.executeScript(tabID,
      {code:"var head = document.createElement('head');var title = document.createElement('title');var text = document.createTextNode('" + setTitle + "');title.appendChild(text);head.appendChild(title);document.body.appendChild(head);document.title='"+setTitle+"';"
      });

  var relTab = tabID;
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   		if (tabId != relTab) {
          return false;
    	}
			chrome.tabs.executeScript(tabID,
				{code:"var head = document.createElement('head');var title = document.createElement('title');var text = document.createTextNode('" + setTitle + "');title.appendChild(text);head.appendChild(title);document.body.appendChild(head);document.title='"+setTitle+"';"
				});
  });
}

chrome.extension.onMessage.addListener(
    function(request,sender,sendResponse) {
        if (request.to == "background") {
            activateLock(request.title, request.relTabID);
        }
    }
) ;

function escapeInput(input) {
  return input.replace(/'/g, "\\'");
}

function contextClick(e){
  chrome.tabs.executeScript(null,
      {code:"var head = document.createElement('head');var title = document.createElement('title');var text = document.createTextNode('" + escapeInput(e.selectionText) + "');title.appendChild(text);head.appendChild(title);document.body.appendChild(head);document.title='"+escapeInput(e.selectionText)+"';"
      });
}

chrome.contextMenus.create({
    title: "Rename Tab to: %s",
    contexts:["selection"],
    onclick: contextClick
});
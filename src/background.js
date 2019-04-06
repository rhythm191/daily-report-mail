chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  chrome.storage.sync.get('selected', function(value) {
    let selected = [];
    request.members.forEach(function(member) {
      selected.push(Number(member.id));
    });

    if (Array.isArray(value.selected)) {
      selected = value.selected;
    }

    chrome.storage.sync.set({
      members: request.members,
      selected: selected,
      value: value
    });
  });
});

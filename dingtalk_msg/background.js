window.onload = function() {
  // new Notification('当前浏览器可推送钉钉消息', {
    // icon: '48.png',
    // body: '推送成功后，这里会展示名字。请忽略本消息'
  // });
  chrome.extension.onRequest.addListener(
	  function(request, sender, sendResponse) {
		if(request.type==1){
			new Notification('推送钉钉消息', {
				icon: '48.png',
				body: '接收消息的用户：'+request.name
			});	
		}
	});
}
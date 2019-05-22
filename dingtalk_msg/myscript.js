var DingUserList = [{ "userid": "015230283384", "name": "张德良" }];

$(function () {
	var StoryOwner = $('#StoryOwner').val();
	(function () {//等待1秒重新加载处理人
		if (!StoryOwner) {
			setTimeout(function () {
				StoryOwner = $('#StoryOwner').val();
			}, 1000);
		}
	})();
	//编辑工单
	$('#btn_update_exit').click(function () {
		sendDingTalk($('#StoryOwner').val(), '编辑');
	});
	//新建需求
	$('#btn_save_view').click(function () {
		sendDingTalk($('#StoryOwner').val(), '新建需求');
	});
	//新建缺陷
	$('#_view').click(function () {
		sendDingTalk($('#BugCurrentOwner').val(), '新建缺陷');
	});
	//流转工单
	$('#update_status_btn').click(function () {
		sendDingTalk($('#STATUS_planning-planningOwner').val() || $('#STATUS_new-newCurrentOwnerValue').val(), '流转');
	});
	(function () {
		function getV() {
			return $('#ContentStatusOwner .editable-value').text()
				|| $('#ContentCurrentOwner .editable-value').text();
			// || $('#owner-field-value .editable-value').prop('title');//内嵌页面无法获取
		}
		//已有工单编辑处理人
		var _u = getV();
		lunxun();
		function lunxun() {
			setInterval(function () {
				var _uuu = getV();
				if (_uuu && _uuu != _u) {
					console.log(_u, getV());
					_u = getV();
					sendDingTalk(_u || '', '变更处理人');
				}
			}, 500);
		}
	})();

	//处理人变更
	$('#StoryOwnerValue').on('change', function (e) {
		if (window.location.pathname.indexOf('/edit/') > -1 || window.location.pathname.indexOf('/view/') > -1) {
			console.log('直接变更处理人', e.delegateTarget.value);
			if (e.delegateTarget.value != StoryOwner) {
				sendDingTalk(e.delegateTarget.value);
			}
		}
	});
	//发送钉钉消息
	function sendDingTalk(name, t) {
		console.log('收到通知请求', name, t);
		var ids = [];
		name.split(';').forEach(function (v) {
			var ding = $.grep(DingUserList, function (n) { return n.name == v; });
			if (ding.length > 0) {
				ids.push(ding[0].userid);
			}
		});
		if (ids.length == 0) { console.log('推送人员空'); return false; }
		var _title = $('#story_name_view .editable-value').text()
			|| $('#bug_title_view .editable-value').text()
			|| $('.title-edit-wrap .editable-value').text()
			|| $('#StoryName').val()
			|| $('#BugTitle').val();
		var _url = "https://o2o.ocpay.cn/v3/vmall.vmall/SendTapdMsg?ids=" + JSON.stringify(ids)
			+ '&msg=' + encodeURIComponent('[' + t + ']' + _title);
		var xhr = new XMLHttpRequest();
		xhr.open("GET", _url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (window.Notification) {
					chrome.extension.sendRequest({ type: 1, name: name, msg: xhr.responseText }, function (response) {
						console.log(response);
					});
				} else { alert('消息已发送，当前浏览器不支持推送消息'); }
			}
		}
		xhr.send();
	}
});




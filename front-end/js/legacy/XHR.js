function newXMLHttpRequest() {
	"use strict";
	var xmlreq = false;

	// Create XMLHttpRequest object in non-Microsoft browsers
	if (window.XMLHttpRequest) {
		xmlreq = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			// Try to create XMLHttpRequest in later versions
			// of Internet Explorer
			xmlreq = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e1) {
			// Failed to create required ActiveXObject
			try {
				// Try version supported by older versions
				// of Internet Explorer
				xmlreq = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e2) {
				// Unable to create an XMLHttpRequest by any means
				xmlreq = false;
			}
		}
	}

	return xmlreq;
}

var XMLHttpFactories = [ 
	function() { return new XMLHttpRequest(); },
	function() { return new ActiveXObject("Msxml2.XMLHTTP");},
	function() { return new ActiveXObject("Msxml3.XMLHTTP");},
	function() { return new ActiveXObject("Microsoft.XMLHTTP");} // For IE6, IE5
];

function createXMLHttpObject() {
	var xmlhttp = false;
	for (var i = 0; i < XMLHttpFactories.length; i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		} catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}

function sendRequest(url, callback, postData) {
	var req = createXMLHttpObject();
	if (!req) return;
	var method = postData ? "POST" : "GET";
	req.open(method, url, true);
	req.setRequestHeader("User-Agent", "XMLHTTP/1.0");
	if (postData) {
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	req.onreadystatechange = function() {
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304) return;
		callback(req);
	};
	if (req.readyState == 4) return;
	req.send(postData);
}
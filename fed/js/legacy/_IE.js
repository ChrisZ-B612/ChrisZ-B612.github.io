//探测IE版本号（适用于IE9及以下版本）
//http://julying.com/blog/determine-the-version-number-of-ie-with-javascript/
var _IE = (function() {
	var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
	//以下这段循环跟后面注释部分意义是一样的，只是作者的写法让人看着比较拙计。
	while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
//	do {
//		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
//	} while (all[0]);
	return v > 4 ? v : false;
}());
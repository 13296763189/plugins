var winW,winH,dpi;
function fontFun() {
	winW = document.documentElement.clientWidth; //浏览器可视宽度
	winH = document.documentElement.clientHeight;
	var starsize=750;
	if (winW >= starsize) {
		dpi=1;
		document.documentElement.style.fontSize = "625%";
	} else {
		dpi=winW / starsize;
		document.documentElement.style.fontSize = (winW / starsize * 625) + "%";
	}
}
// document.write('<meta name="renderer" content="webkit"/>' +
// 	'<meta name="force-rendering" content="webkit"/>' +
// 	'<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>' +
// 	'<meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width">');
fontFun();
window.onresize = fontFun;

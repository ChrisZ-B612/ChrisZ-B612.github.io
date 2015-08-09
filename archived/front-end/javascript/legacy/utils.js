//过滤JavaScript正则表达式中的特殊字符（http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript）。
RegexUtils = {
    constants: [/[-\/\\^$*+?.()|[\]{}]/g],
    literalize: function(src) {
        return src.replace(RegexUtils.constants[0], "\\$&");
    }
};

//获取两个日期之间的所有日期（http://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates）。
Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}

function getDates(startDate, stopDate) {
	 var dateArray = [], currentDate = new Date(startDate.valueOf());
	 while (currentDate <= stopDate) {
		 dateArray.push(currentDate);
		 currentDate = currentDate.addDays(1);
	 }
	 return dateArray;
}
$(function() {
	var box = $("#box");
	var distance = 500;
	$("#baseline").css({
		top : distance
	});
	gravity(distance, box);

	/**
	 * 模拟物体自由落体的过程
	 * 一共有两个阶段：下落阶段和反弹阶段，下落的方向可以为上或下，触底反弹每次损失一半的能量（动能或势能）
	 * 
	 * hs: 初始高度，vs: 初始速度，ht: 某一时刻高度，vt: 某一时刻速度
	 * 能量守恒定律：m * g * hs + 0.5 * m * vs * vs = m * g * ht + 0.5 * m * vt * vt
	 * 由于vt = vs + gt，演算得到某一时刻高度ht = hs - vs * t - 0.5 * g * t * t
	 * 由于在网页中Y坐标向下为正，所以物体向下落时top = distance－ht，向上升时top = ht 
	 */
	function gravity(distance, target) {
		/**
		 * g: 加速度为0.378pixel/ms2，相当10m/s2
		 */
		var g = 0.378;
		/**
		 * vs: 物体的初始速度
		 * H: 向下落时为distance，向上升时为0
		 * drop: 向南方下落时为-1，向北方上升时为1
		 * first: true代表下落阶段，false代表反弹阶段
		 * hs: 代表当前阶段物体的高度，first=true时为distance，此时物体准备下落；first=false时为0，此时物体触底反弹
		 * h: 用来计算当前物体的势能，然后计算转换为动能之后物体的速度vs
		 * T: 物体下落阶段或反弹阶段需要消耗的时间，单位为毫秒
		 * t: 控制页面物体图像的刷新，从0开始递增直至T
		 */
		var vs = 0, H = distance, drop = -1, first = true, t = 0, hs = distance, h = distance, T = Math.sqrt((2 * h / g));
		var timer = setInterval(function() {
			if (t < T) {
				/**
				 * 公式：H + drop * (hs - vs * t - 0.5 * g * t * t)
				 * 计算物体距离X轴的距离
				 */
				target.css("top", H + drop * (hs - vs * t - 0.5 * g * t * t));
				// console.info(target.position().top);
				t++;
			} else {
				// 因为t只精确到了ms，所以这里需要补足剩下的误差
				target.css("top", H + drop * (hs - vs * T - 0.5 * g * T * T));
				if (first) {
					first = false;
					hs = 0;//触底反弹，设置hs为0
				}
				h = h / 2;//能量损失一半
				vs = -Math.sqrt(2 * g * h);//计算速度，与加速度方向相反，所以这里为负号
				t = 0;
				T = Math.floor(2 * Math.sqrt((2 * h / g)));
				if (h < 1) {//换个方向再来一次
					drop = -drop;
					if (drop === 1) {
						H = 0;
					} else if (drop === -1) {
						H = distance;
					}
					vs = 0;
					t = 0;
					h = distance;
					T = Math.sqrt((2 * h / g));
					hs = distance;
					first = true;
					return;
				}
			}
		}, 1);
	}
});
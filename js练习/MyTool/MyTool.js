(function(w) {
	w.myTool = {
		$: function(id) {
			return typeof id === 'string' ? document.getElementById(id) : null;
		},
		scroll: function() {
			if(window.pageYOffset !== null) {
				return {
					"top": window.pageYOffset,
					"left": window.pageXOffset
				}
			} else if(document.compatMode === 'CSS1Compat') { //w3c
				return {
					"top": document.documentElement.scrollTop,
					"left": document.documentElement.scrollLeft
				}
			}
			return {
				"top": document.body.scrollTop,
				"left": document.body.scrollLeft
			}
		},
		
		client: function() {
			if(window.innerWidth) { // ie9+ 最新的浏览器
				return {
					"width": window.innerWidth,
					"height": window.innerHeight
				}
			} else if(document.compatMode === "CSS1Compat") { // W3C
				return {
					"width": document.documentElement.clientWidth,
					"height": document.documentElement.clientHeight
				}
			}

			return {
				"width": document.body.clientWidth,
				"height": document.body.clientHeight
			}
		},
		waterFull: function(parent, child) {
			// 1. 父盒子居中
			// 1.1 获取所有的盒子
			var allBox = $(parent).getElementsByClassName(child);
			// 1.2 获取子盒子的宽度
			var boxWidth = allBox[0].offsetWidth;
			// 1.3 获取屏幕的宽度
			var screenW = document.documentElement.clientWidth;
			// 1.4 求出列数
			var cols = parseInt(screenW / boxWidth);
			// 1.5 父盒子居中
			$(parent).style.width = cols * boxWidth + 'px';
			$(parent).style.margin = "0 auto";

			// 2. 子盒子的定位
			// 2.1 定义高度数组
			var heightArr = [],
				boxHeight = 0,
				minBoxHeight = 0,
				minBoxIndex = 0;
			// 2.2 遍历子盒子
			for(var i = 0; i < allBox.length; i++) {
				// 2.2.1 求出每一个子盒子的高度
				boxHeight = allBox[i].offsetHeight;
				// 2.2.2 取出第一行盒子的高度放入高度数组
				if(i < cols) { // 第一行
					heightArr.push(boxHeight);
					allBox[i].style = '';
				} else { // 剩余行
					// 1. 取出最矮的盒子高度
					minBoxHeight = _.min(heightArr);
					// 2. 求出最矮盒子对应的索引
					minBoxIndex = getMinBoxIndex(heightArr, minBoxHeight);
					// 3. 子盒子定位
					allBox[i].style.position = "absolute";
					allBox[i].style.left = minBoxIndex * boxWidth + 'px';
					allBox[i].style.top = minBoxHeight + 'px';
					// 4. 更新数组中的高度
					heightArr[minBoxIndex] += boxHeight;
				}
			}

			// console.log(heightArr, minBoxHeight, minBoxIndex);
		},
		/*
		 * 缓动动画函数
		 * @param {Object} obj
		 * @param {Object} json
		 * @param {Function} fn
		 */
		buffer: function(obj, json, fn) {
			// 1.1 清除定时器
			clearInterval(obj.timer);

			// 1.2 设置定时器
			var begin = 0,
				target = 0,
				speed = 0;
			obj.timer = setInterval(function() {
				// 1.3.0 旗帜
				var flag = true;
				for(var key in json) {
					if (json.hasOwnProperty(key)) {
						// 1.3 获取初始值
						if("opacity" === key) {
							begin = Math.round(parseFloat(myTool.getCSSAttrValue(obj, key)) * 100) || 100;
							target = parseInt(json[key] * 100);
						} else if('scrollTop' === key) {
							begin = Math.ceil(Number(obj.scrollTop));
							target = parseInt(json[key]);
						}else {
							begin = parseInt(myTool.getCSSAttrValue(obj, key)) || 0;
							target = parseInt(json[key]);
						}
	
						// 1.4 求出步长
						speed = (target - begin) * 0.2;
	
						// 1.5 判断是否向上取整
						speed = (target > begin) ? Math.ceil(speed) : Math.floor(speed);
	
						// 1.6 动起来
						// 1.6 动起来
						if("opacity" === key) { // 透明度
							// w3c的浏览器
							obj.style.opacity = (begin + speed) / 100;
							
						} else if('scrollTop' === key){
							
							obj.scrollTop = begin + speed;
							
						} else if("zIndex" === key) {
							obj.style[key] = json[key];
						} else{
							obj.style[key] = begin + speed + 'px';
						}
	
						// 1.5 判断
						if(begin !== target) {
							flag = false;
						}
					}
				}

				// 1.3 清除定时器
				if(flag) {
					clearInterval(obj.timer);

					//console.log(fn);

					// 判断有没有回调函数
					if(fn) {
						fn();
					}
				}
			}, 20);
		},
		/**
		 *  匀速动画函数
		 * @param {object}obj
		 * @param {number}target
		 * @param {number}speed
		 */
		constant:function (obj, target, speed) {
		    // 1. 清除定时器
		    clearInterval(obj.timer);
		
		    // 2. 判断方向
		    var dir = obj.offsetLeft < target ? speed : -speed;
		
		
		    // 3. 设置定时器
		    obj.timer = setInterval(function () {
		        obj.style.left = obj.offsetLeft + dir + "px";
		
		        if(Math.abs(target - obj.offsetLeft) < Math.abs(dir)){
		            clearInterval(obj.timer);
		
		            obj.style.left = target + "px";
		            console.log(obj.offsetLeft, target);
		        }
		    }, 20);
		
		},
		/**
		 * 获取css的样式值
		 * @param {object}obj
		 * @param attr
		 * @returns {*}
		 */
		getCSSAttrValue: function(obj, attr) {
			if(obj.currentStyle) { // IE 和 opera
				return obj.currentStyle[attr];
			} else {
				return window.getComputedStyle(obj, null)[attr];
			}
		},
		/*传递过来的参数只能通过下标的方式进行改变值，不能通过点语法进行设置*/
		/**
		 * 改变css的属性
		 * @param {object}obj
		 * @param attr
		 * @param value
		 * @returns {*}
		 */
		changeCssStyle: function(obj, attr, value) {
			obj.style[attr] = value;
			/*obj.style.attr = value;不可以实现，必须用下标的方式*/
		}
	}
})(window);
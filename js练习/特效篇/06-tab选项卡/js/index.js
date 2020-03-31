window.onload = function() {
	//  1.获取标签
	var allLis = $('tab_header').getElementsByTagName('li');
	var allDom = $('tab_content').getElementsByClassName('dom');
	
	//  2.遍历监听
	for (var i = 0; i < allLis.length; i++) {
		var li = allLis[i];
		
		
		//闭包排他思想
		/*(function(i){
			li.onclick = function(){
				//  1.清除同级别的选中样式
				for(var j = 0; j < allLis.length; j++){
					allLis[j].className = '';
					allDom[j].style.display = 'none'
				}
				//  2.设置当前的li标签的选中样式
				this.className = 'selected';
				allDom[i].style.display = 'block';
			}
		})(i)*/
		
		
		//普通实现
		li.index = i;
		li.onclick = function(){
				//  1.清除同级别的选中样式
				for(var j = 0; j < allLis.length; j++){
					allLis[j].className = '';
					allDom[j].style.display = 'none';
				}
				//  2.设置当前的li标签的选中样式
				this.className = 'selected';
				allDom[this.index].style.display = 'block';
	    }
	}
}
function $(id) {
		return typeof id === 'string' ? document.getElementById(id) : null;
}
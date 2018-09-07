function scoreFun(object,opts){
	// 默认属性
	var defaults={
		fen_d:.45,  // 每个a的宽度
		ScoreGrade:10,  // a的个数
		nameScore:"fenshu",//分数类
		parent:"star_score",//存放星星的容器
		attitude:"attitude"//打分的评语
	};
	options = $.extend({},defaults,opts);//函数用于将一个或多个对象的内容合并到目标对象

	var countScore = object.find("." + options.nameScore);  // 找到名为“fenshu”的类
	var startParent = object.find("." + options.parent);    // 找到名为“star_score”的类
	var atti = object.find("." + options.attitude);    // 找到名为“attitude”的类

	var now_cli;
	var fen_cli;
	var atu;

	var fen_d = options.fen_d;     // 每个a的宽度
	var len = options.ScoreGrade;  // 把a的个数赋值给len
	startParent.width(fen_d*len+"rem"); //包含a的div盒子的宽度 存放星星的容器的宽度；
	var preA = (10/len);

	for(var i = 0;i < len; i++){

		var newSpan = $("<a href='javascript:void(0)'></a>");     // 不整体刷新页面的情况下，可以使用void(0)

		newSpan.css({"left":0,"width":fen_d*(i+1)+'rem',"z-index":len-i});  // 设置a的宽度、层级

		newSpan.appendTo(startParent)  //  把a放到类名为“star_score”的div里
	}
												
	startParent.find("a").each(          // each（）方法 查看存放星星的容器“star_score”的a
		
		function(index,element){

			$(this).on('click', function(){     // 点击事件

				now_cli = index;          // 当前a的索引值
				show(index,$(this))       //  调用show方法
				console.log($(this))
		});


	});

	// show方法
	function show(num,obj){

		var n = parseInt(num)+1;
		var lefta = num*fen_d;  //fen_d 为每个a的宽度 
		var ww = fen_d*n+'rem';
		var scor = preA*n;     // 评分数字
			
		object.find("a").removeClass("clibg");   // 清除所有a的“clibg”类

		obj.addClass("clibg");                  // 给当前a添加“clibg”类

		obj.css({"width":ww,"left":"0",});     // 给当前a添加宽度“ww”和left值

		countScore.text(scor);                // 显示评分
		
		atti.text(atu);                      // 显示用户态度
	}

};
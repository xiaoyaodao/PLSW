
$(document).ready(function(){
   
  
    if(localStorage.getItem('bookKey', bookKey) == null){

        var search = location.search;//获取评论人的id
        var data = search.slice(1);

        var bookCoreId = data.split('&')[0];//获取到书的id信息
        var bookKey = bookCoreId.split('=')[1];//获取到书的id值

        var code = data.split('&')[1];//获取到用户id的信息
        var userKey = code.split('=')[1];//获取到用户的id值
                
        localStorage.setItem('bookKey', bookKey);
        localStorage.setItem('userKey', userKey);
      
        $.ajax({
            type:"POST",
            url:"https://api.uwooz.com/mxapi/wechat/getAuth",
            data:"code=" + localStorage.getItem('userKey'),

            success : function(res){
                if (res.errorCode === 200) {
                
                    if (res.data.data.userId) {
                        localStorage.setItem('userId', res.data.data.userId);
                        console.log(localStorage.getItem('userId'));
                        add();
                    }
                }

            }
        });

    }else{
        add();
      
    }

    function add(){
      
        //第一个参数"mescroll"对应上面布局结构div的id
        var mescroll = new MeScroll("mescroll", { 

            up: {
                auto:true,//初始化完毕,是否自动触发上拉加载的回调
                isBounce: false, //此处禁止ios回弹
                callback: upCallback, //上拉加载的回调
                htmlNodata: '<p class="upwarp-nodata">-- 别扯了~我是有底线的... --</p>',
                noMoreSize:5,
                clearEmptyId: "newsList", //1.下拉刷新时会自动先清空此列表,再加入数据; 2.无任何数据时会在此列表自动提示空
                hardwareClass:"mescroll-hardware",
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 5, //每页数据条数
                    time: null //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
                },

                toTop:{ //配置回到顶部按钮
                    src : "./img/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                    // offset : 700
                }
            },
          

        });


        /* 书的相关信息  */

        //加签名
        var data = {
            userId:localStorage.getItem('userId'),
            id:localStorage.getItem('bookKey'),
            sourceId:2         
        }
        var md5 = md5Encryption(data,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');
        
        $.ajax({
            type: "POST",
            url: "https://test.uwooz.com/mxapi/book/getBookInfo",
            data:{
                userId: localStorage.getItem('userId'),
                id:localStorage.getItem('bookKey'),
                sourceId :'2',             
                signed: md5
             },
            success: function (msg) {
                var data = msg.data;
                var headerDetails = "";
                var scoreStar = ""

                console.log(msg.data)

                // 书名 中文
                $('.header-title .p1').append(data.chinaName);

                // 书名 英文
                $('.header-title .p2').append(data.englishName);

                // 图书的相关信息
                headerDetails +='\
                <ul>\
                    <li>类型：<span>'+data.typeName+'</span> </li>\
                    <li>作者：<span>'+data.author+'</span> </li>\
                    <li>字数：<span>'+data.numberWord+'</span> </li>\
                    <li>出版：<span>'+data.publishing+'</span> </li>\
                </ul>\
                '
                $('.header-details').append(headerDetails);

                // 图书封面
                $('.header-right').append(`<img src=${data.bookImage} >`);

                // 背景图片
                $('header').css({'background':`url(${data.backageImage}) no-repeat`,'background-size':'100%'})

                // 头部评分
                scoreStar +='\
                    <div class="show_number clearfix">\
                        <span></span>\
                        <div class="atar_Show">\
                            <p tip='+data.grade+'></p>\
                        </div>\
                    </div>\
                '            
                $('.score-star').append(scoreStar);
                
                // 显示分数
                $(".atar_Show p").each(function(index, element) {
                    var num = $(this).attr("tip");
                    var www = num*1* .25 + "rem";
                    $(this).css("width",www);
                    $(this).parent(".atar_Show").siblings("span").text(num);
                });

                // 评论数
                $('.number-of-omments').append(data.numberCounts);

                // 阅读人数
                $('.score-info span').append(data.pageview);

                // 书的简介
                $('.section-top-info .section-info-details').append(data.intro);

                $(".section-info-more").on('click', function(){

                    if($(".section-info-details").get(0).offsetHeight<200){
                        $(".section-info-details").css("height", "9rem");
                        $(".section-info-more").text("收起");
            
                    }else{
                        $(".section-info-details").css("height", "1.9rem");
                        $(".section-info-more").text("更多");
                    }
                });

                // 书本推荐语
                var bookRecommendList = '';
                for(var i = 0; i<data.bookRecommendList.length; i++ ){

                    bookRecommendList+='\
                    <div class="section-top-center">\
                        <div class="section-center-img">\
                            <img src="./img/sign-01.png" alt="">\
                        </div>\
                        <p class="section-center-info">\
                        '+data.bookRecommendList[i].content+'\
                        </p>\
                    </div>\
                    '
                }
                $('.section-top-content').append(bookRecommendList);

                // 读者总评分
                $('.readers-evaluate-p1').append(data.grade);

                // 评分总人数
                $('.readers-evaluate-num2').append(data.numberCounts);

                // 各评分所占的百分比
                $('.star-5').css("width",data.proportion5 +"%");
                $('.star-4').css("width",data.proportion4 +"%");
                $('.star-3').css("width",data.proportion3 +"%");
                $('.star-2').css("width",data.proportion2 +"%");
                $('.star-1').css("width",data.proportion1 +"%"); 
                
                 /* 
                    将中文书名传到评论页 并将其加到title里面            
                    Js的Url中传递中文参数乱码问题解决方案  encodeURI编码，decodeURI解码为例。
                    传参页面
                */ 
                function send(){
                    var url = "comment.html";
                    var userName = data.chinaName;
                    location.assign(encodeURI(url + "?userName=" + userName)); 
                }

                // 跳转到评论页
                $('footer').on('click', function(e){                   
                    send()
                }); 
                    
            },
        
            error: function(error){
                alert('页面加载出错，请刷新重试！');                 
            }
            
        })

      
        // 上拉加载的回调   
        function upCallback(page){
            
            var pageIndex  = page.num-1;
            console.log(pageIndex)

            //加签名
            var signData = {
                userId:localStorage.getItem('userId'),
                sourceId:2, 
                id:localStorage.getItem('bookKey'),
                page:pageIndex,
                pageSize:page.size
            }
            var md5 = md5Encryption(signData,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');

            $.ajax({
                type: "GET",
                url: "https://test.uwooz.com/mxapi/book/getBookCommentInfo",
                data:{
                    userId: localStorage.getItem('userId'),
                    id:localStorage.getItem('bookKey'),
                    sourceId:'2',
                    page:pageIndex,
                    pageSize:page.size,
                    signed: md5
                },
                success: function (curPageData) {
                 
                    var data = curPageData.data;
                    var datasd = curPageData.data.data;
                    console.log(data)                  
                    //console.log(data.total);//总评论
            
                    //方法二(推荐): 后台接口有返回列表的总数据量 totalSize 必传参数(当前页的数据个数, 总数据量)   
                    mescroll.endBySize(data.pageSize, data.total);  

                    if( datasd.length > 0){
                        var comment = '';
                        for(var i = 0; i<datasd.length; i++){
                            var datas = datasd[i];
                            
                            comment+='<li class="article-comment-info">\
                                    <div class="article-top" data-info = '+datas.userInfo+' >\
                                        <!-- 头像 -->\
                                        <div class="article-headPortrait">\
                                        '+ (datas.userInfo !== null ? '<img src="'+datas.userInfo.headimgurl+'" alt=""/>' :  '<img src="./img/logo.png" alt=""/>') +'\
                                        </div>\
                                        <!-- 评分相关信息 -->\
                                        <div class="article-recollections">\
                                            <!-- 评论者昵称 -->\
                                            <p class="article-recollections-title">\
                                                '+ (datas.userInfo !== null ? datas.userInfo.nickname :  '那人忘了...')+'\
                                            </p>\
                                            <!-- 评论评分 -->\
                                            <div class="article-recollections-score clearfix">\
                                                <div class="score_Show">\
                                                    <p tip="'+datas.grade+'"></p>\
                                                </div>\
                                                &nbsp;<span></span>\
                                            </div>\
                                        </div>\
                                        <!-- 举报 -->\
                                        <div class="article-more">\
                                            <div class="spot-img">\
                                                <img src="./img/spot-h.png" alt="">\
                                            </div>\
                                            <!-- 遮罩层 -->\
                                            <div class="eject-wrap">\
                                                <!-- 点击弹出 -->\
                                                <div class="popup">\
                                                    <div class="popup-info">举报</div>\
                                                    <div class="close">取消</div>\
                                                </div>\
                                                <div class="popup-eject">\
                                                    <div class="popup-eject-return">\
                                                        <div class="return-img">\
                                                            <img src="./img/return.png" alt="返回上一页">\
                                                        </div>\
                                                        <div class="popup-eject--info">举报</div> \
                                                    </div>\
                                                    <div class="popup-content-info">\
                                                        <div class="popup-content-info-1 popup-content-info-z">\
                                                            <div  class="popup-radio">\
                                                                <input type="radio" name="centent"/>\
                                                            </div>\
                                                            <div>辱骂、歧视、挑衅等不友好的内容!</div>\
                                                        </div>\
                                                        <div class="popup-content-info-2 popup-content-info-z">\
                                                            <div  class="popup-radio">\
                                                                <input type="radio" name="centent"/>\
                                                            </div>\
                                                            <div>广告、诈骗、或者垃圾内容!</div>\
                                                        </div>\
                                                        <div class="popup-content-info-3 popup-content-info-z">\
                                                            <div  class="popup-radio">\
                                                                <input type="radio" name="centent">\
                                                            </div>\
                                                            <div>色情、暴力、诋毁政治等触犯法律法规的内容!</div>\
                                                        </div>\
                                                    </div> \
                                                    <div class="submission">\
                                                        <input type="submit" value="提 交" />\
                                                    </div> \
                                                </div> \
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="article-content">\
                                        <!-- 评论内容 -->\
                                        <p class="article-content-info" data-id="'+datas.id+'" data-type="'+ pageIndex +'">\
                                        ' +datas.content+'\
                                        </p>\
                                    </div>\
                                    <div class="article-bottom">\
                                        <div class="article-bottom-time">\
                                            <!-- 评论时间 -->\
                                            <span class="article-time-data">'+datas.createTime+'</span>\
                                        </div>\
                                        <div class="article-bottom-right">\
                                            <div class="article-bottom-fabulous"> \
                                                <!-- 点赞 -->\
                                                <div class="article-fabulous-img  praise" data-ida="'+datas.id+'" data-typea ="'+datas.userAssist+'">'+
                                                (datas.userAssist == true ? '<img src="./img/yizan.png" class="praise-img">' :'<img src="./img/favor-small.png" class="praise-img">')+
                                                '</div>\
                                                <!-- 点赞的数量 -->\
                                                <p class="article-fabulous-num praise-txt" >'+
                                                (datas.assistCount === 0 ? "赞" : datas.assistCount)
                                                +'</p>\
                                                <span class="add-num"><em>+1</em></span>\
                                            </div>\
                                            <!-- 回复条数 点击跳转到评论详情页 -->\
                                            <div class="article-bottom-comment" data-id="'+datas.id+'" data-type="'+ pageIndex +'">\
                                                <div class="article-comment-img">\
                                                    <img src="./img/comment-small.png" alt="">\
                                                </div>\
                                                <p class="article-comment-num">'+datas.bookReplyList.length+'</p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </li>\
                            ' 
                          
                        }
                       
                        $('#newsList').append(comment); 

                        //点击.spot-img时要阻止冒泡，否则.eject-wrap是不显示的，
                        //因为冒泡了，会执行到下面的方法。
                        function stopPropagation(e) {
                            var ev = e || window.event;
                            if (ev.stopPropagation) {
                                ev.stopPropagation();
                            }
                            else if (window.event) {
                                window.event.cancelBubble = true;//兼容IE
                            }
                        }                       
                        // 获取元素，设置单击事件
                        $('.spot-img').off("click").on( 'click', function(e){
                            $(this).parent().children(".eject-wrap").show();
                            stopPropagation(e);
                        });
                        // 单击关闭按钮，隐藏元素
                        $('.close').off("click").on( 'click', function(e){
                            $(this).parent().parent().hide();                          
                        });
                        // 鼠标在div里操作不隐藏
                        $(".eject-wrap").click(function (e) {
                            stopPropagation(e);
                        });
                        // 点击div之外的地方 div隐藏
                        $(document).bind("click", function(){
                            $(".eject-wrap").hide();     
                        });

                         // 点击打开举报页面
                        $('.popup-info').on('click', function(e){
                            $(".popup-eject").show();  
                        });  
                        // 点击关闭举报页面
                        $('.return-img').on('click', function(e){
                            $(".popup-eject").hide();  
                        });  

                        // 点击举报
                        $('.submission').off('click').on('click', function(e){
                            var bFlaga = false;

                            var gender = document.getElementsByName('centent');
                            var val;
                            for(radio in gender) {
                                if(gender[radio].checked) {
                                    bFlaga = true;
                                    val = gender[radio].value;
                                    break;
                                }
                            }
                            
                            if (bFlaga == false) {
                                alert('类别不能为空，请选择！')
                                return false;
                            }

                            alert('举报成功!');
                            $(this).parent(".popup-eject").hide(); 
                            $(this).parent(".popup-eject").empty(); 
                
                        });  
                      

                        // 显示分数
                        $(".score_Show p").each(function(index, element) {
                            var num = $(this).attr("tip");
                            var www = num*1*.146 + "rem";
                            $(this).css("width",www);
                            $(this).parent(".score_Show").siblings("span").text(num);
                        });

                        console.log(datas.assistCount)
                        // 点赞
                        $('.praise').off("click").on('click', function(e){
                            // 获取图片id 
                            var praise_img = $(this).children(".praise-img");
                            // 加一减一的数字
                            var text_box = $(this).parent().children(".add-num");
                            // 点赞的数量
                            var praise_txt = $(this).parent().children(".praise-txt");

                            if(praise_txt.text() == '赞'){                             
                                praise_txt.text(0);
                            }

                            // 将数字添加到 id为praise-txt的p标签中；
                            var num = parseInt(praise_txt.text());       
                            
                            if($(this).attr("data-typea") == 'true'){            
                                $(this).html("<img src='./img/favor-small.png' class='animation praise-img' />");
                                praise_txt.removeClass("hover");
                                text_box.show().html("<em class='add-animation'>-1</em>");
                                $(this).parent().children(".add-num").children(".add-animation").removeClass("hover");
                                num -=1;
                                praise_txt.text(num)
                                $(this).attr("data-typea", "false");

                            }else{            
                                $(this).html("<img src='img/yizan.png' class='animation praise-img' />");
                                praise_txt.addClass("hover");
                                text_box.show().html("<em class='add-animation'>+1</em>");                       
                                $(this).parent().children(".add-num").children(".add-animation").addClass("hover");
                                num +=1;
                                praise_txt.text(num);
                                $(this).attr("data-typea", "true");
                            }
                            if(praise_txt.text() == 0){                             
                                praise_txt.text('赞');
                            }
                           

                            //点赞签名
                            var datad = {
                                bookCommentId:e.currentTarget.dataset.ida,//评论id
                                userId:localStorage.getItem('userId'),
                                sourceId:2                                
                            }
                            var md5 = md5Encryption(datad,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');
                            console.log( e.currentTarget.dataset.ida);
                            console.log( e.currentTarget.dataset.typea);
                            console.log("&bookCommentId=" +e.currentTarget.dataset.ida +", &userId=" + localStorage.getItem('userKey') +', &sourceId=2'+', &signed='+md5);
                            $.ajax({
                                type: 'POST',
                                url: 'https://test.uwooz.com/mxapi/book/addAssist',                   
                                data:{
                                    bookCommentId:e.currentTarget.dataset.ida,
                                    userId:localStorage.getItem('userId'),
                                    sourceId:2, 
                                    signed:md5                               
                                },
                                success: function (res) {
                                    if(res.errorCode === 200){                          
                                        $(this).attr("data-typea", "true");                                                                
                                        console.log(res.message);

                                    }
                                    if(res.errorCode === 201){
                                        $(this).attr("data-typea", "false");                                                                   
                                        console.log(res.message);
                                    }
  
                                }
                        
                            })

                        
                        });

                    }

                     //跳转到评论详情页 
                    $('.article-bottom-comment').on('click', function(event){
                        location.assign('./reply.html?id=' + event.currentTarget.dataset.id+'&page='+event.currentTarget.dataset.type);
                    });      
                      
                    //跳转到评论详情页 
                    $('.article-content-info').on('click', function(event){
                        location.assign('./reply.html?id=' + event.currentTarget.dataset.id+'&page='+event.currentTarget.dataset.type);
                    });      
                   
                },
                                
                error: function(error){
                    mescroll.endErr();
                    alert('页面加载出错，请刷新重试！');   
                }
                
            })
          
        };
   			
     

    
  
    }
});

























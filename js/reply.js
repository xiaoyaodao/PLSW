
$(document).ready(function () {
    var search = location.search;//获取评论人的id
    var data = search.slice(1);

    var commentData = data.split('&')[0];//获取到id
    var commentId = commentData.split('=')[1]; //获取到id值

    var page = data.split('&')[1];//获取到页数信息
    var pageNum = page.split('=')[1];//获取到页数的值

    
    console.log(search);
    console.log(data);
    console.log(commentData);
    console.log(commentId);
    console.log(page);
    console.log(pageNum);


    var size = 5;

    //加签名
    var data = {
        id:localStorage.getItem('bookKey'),
        userId:localStorage.getItem('userId'),
        sourceId:2, 
        page:pageNum,
        pageSize:size         
    }
    var md5 = md5Encryption(data,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');

    $.ajax({
        type: "POST",
        url: "https://test.uwooz.com/mxapi/book/getBookCommentInfo",
        data:{           
            id:localStorage.getItem('bookKey'),
            userId: localStorage.getItem('userId'),
            sourceId :'2',
            page:pageNum ,
            pageSize:size,
            signed: md5
         },

        success: function (msg) {
            var data = msg.data;
            var datasd = data.data;

            var commentNode = '';
            var fabulous = '';
            var replyDataNode = '';
            var userInfo = '';
             
           
            for(var i = 0; i < datasd.length; i++){
               
                var datas = datasd[i];          
                console.log(datas)

                /* 评论者的相关信息 */
                if(datas.id == commentId ){
                        
                    commentNode+= '\
                        <div class="main-top">\
                            <!-- 头像 -->  \
                            <div class="main-headPortrait">\
                                '+ (datas.userInfo !== null ? '<img src="'+datas.userInfo.headimgurl+'" alt=""/>' :  '<img src="./img/logo.png" alt=""/>') +'\
                            </div>\
                            <!-- 评分相关信息 -->\
                            <div class="main-recollections">\
                                <!-- 评论者昵称 -->\
                                <p class="main-recollections-title">\
                                '+ (datas.userInfo !== null ? datas.userInfo.nickname :  '我忘了...')+'\
                                </p>  \
                                <div class="article-recollections-score clearfix"> \
                                    <div class="score_Show">\
                                        <p tip="'+datas.grade+'"></p>\
                                    </div>\
                                    &nbsp;<span></span>\
                                </div>\
                            </div>\
                            <!-- 举报 -->\
                            <div class="main-more">\
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
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        </div>\
                        <!-- 评论内容 -->\
                        <div class="main-content">\
                            <p class="main-content-info">\
                                '+datas.content+'\
                            </p>\
                        </div> \
                        <div class="main-bottom">\
                            <!-- 评论时间 -->\
                            <div class="main-bottom-time">\
                                <span class="main-time-data">'+datas.createTime+'</span>\
                            </div> \
                            <div class="main-bottom-right">\
                                <div class="main-bottom-fabulous">\
                                    <!-- 点赞 -->\
                                    <div class="main-fabulous-img praise" data-id="'+datas.id+'" data-type ="'+datas.userAssist+'">'+
                                    (datas.userAssist==true ? '<img src="./img/yizan.png" class="praise-img">' :'<img src="./img/favor-small.png" class="praise-img">')+
                                    '</div>\
                                    <!-- 点赞的数量 -->\
                                    <p class="main-fabulous-num praise-txt"> '+
                                    (datas.assistCount === 0 ? "赞" : datas.assistCount)
                                    +'</p>\
                                    <span class="add-num"><em>+1</em></span>\
                                </div>\
                                <!-- 回复条数 -->\
                                <div class="main-bottom-comment">\
                                    <div class="main-comment-img">\
                                        <img src="./img/comment-small.png" alt="">\
                                    </div>\
                                    <p class="main-comment-num">'+datas.bookReplyList.length+'</p>\
                                </div>\
                            </div>\
                        </div> \
                        ';

                    /* 回复评论者的相关内容 */ 
                    for(var b = 0; b < datas.bookReplyList.length; b++){
                        var replyData =  datas.bookReplyList[b];
                                            
                        // console.log(datas.bookReplyList.length);                       
                        console.log(replyData);
                        // console.log(replyData.userInfo.id);
                        console.log(replyData.id);

                        replyDataNode+= '\
                        <div class="section-comment-info">\
                            <div class="section-top">\
                                <!-- 头像 -->   \
                                <div class="section-headPortrait">\
                                '+ (replyData.userInfo !== null ? '<img src="'+replyData.userInfo.headimgurl+'" alt=""/>' :  '<img src="./img/logo.png" alt=""/>') +'\
                                </div>\
                                <!-- 回复评论者昵称-->  \
                                <div class="section-recollections">\
                                    <p class="section-recollections-title">\
                                    '+ (replyData.userInfo !== null ? replyData.userInfo.nickname :  '我忘了...')+'\
                                    </p>\
                                </div>\
                                <!-- 举报 -->\
                                <div class="section-more">\
                                    <div class="section-spot-img">\
                                        <img src="./img/spot-h.png" alt="">\
                                    </div>\
                                    <!-- 遮罩层 -->\
                                    <div class="section-eject-box">\
                                        <!-- 点击弹出 -->\
                                        <div class="section-popup">\
                                            <div class="section-popup-info">举报</div>\
                                            <div class="section-close">取消</div>\
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
                                                        <input type="radio" name="type-r"/>\
                                                    </div>\
                                                    <div>辱骂、歧视、挑衅等不友好的内容!</div>\
                                                </div>\
                                                <div class="popup-content-info-2 popup-content-info-z">\
                                                    <div  class="popup-radio">\
                                                        <input type="radio" name="type-r"/>\
                                                    </div>\
                                                    <div>广告、诈骗、或者垃圾内容!</div>\
                                                </div>\
                                                <div class="popup-content-info-3 popup-content-info-z">\
                                                    <div  class="popup-radio">\
                                                        <input type="radio" name="type-r">\
                                                    </div>\
                                                    <div>色情、暴力、诋毁政治等触犯法律法规的内容!</div>\
                                                </div>\
                                            </div> \
                                            <div class="submission section-submission">\
                                                <input type="submit" value="提 交" />\
                                            </div> \
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                            <!-- 回复评论者的内容详情--> \
                            <div class="section-content">\
                                <p class="section-content-info">'+replyData.content+'</p>\
                            </div>\
                            <div class="section-bottom"> \
                                <div class="section-bottom-time">\
                                    <span class="section-time-data">'+replyData.createTime+'</span>\
                                </div>\
                                <div class="section-bottom-right">\
                                    <div class="section-bottom-fabulous">\
                                        <!-- 点赞 -->\
                                        <div class="section-fabulous-img" data-id2="'+replyData.id+'" data-type2 ="'+replyData.userAssist+'">'+
                                        (replyData.userAssist == true ? '<img src="./img/yizan.png" class="praise-img">' :'<img src="./img/favor-small.png" class="praise-img">')+
                                        '</div>\
                                        <!-- 点赞的数量 -->\
                                        <p class="section-fabulous-num praise-txt" >'+
                                        (replyData.assistCount === 0 ? "赞" : replyData.assistCount)
                                        +'</p>\
                                        <span class="add-num"><em>+1</em></span>\
                                    </div>\
                                </div>\
                            </div> \
                        </div>\
                        '
                    }
                   
                    fabulous += datas.bookReplyList.length; // 回复的条数
                    userInfo += datas.userInfo.id; // 评论人的id
                    localStorage.setItem('userInfo', userInfo); //将评论id的存起来

                } 
                         
            }


            $('.main-comment-info').append(commentNode);

            //  回复评论者的内容详情
            $('section').append(replyDataNode);

             //点击.spot-img时要阻止冒泡，否则.eject-wrap是不显示的，
            //因为冒泡了，会执行到下面的方法。
            function stopPropagation(e) {
                var ev = e && window.event;
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                }
                else if (window.event) {
                    window.event.cancelBubble = true;//兼容IE
                }
            }
            
            // 获取元素，设置单击事件
            $('.spot-img').on( 'click', function(e){
                $(this).parent().children(".eject-wrap").show();
                stopPropagation(e);
            });        
            // 单击关闭按钮，隐藏元素
            $('.close').on( 'click', function(){
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
            $('.submission').on('click', function(e){
                var bFlaga = false;

                var genderd = document.getElementsByName('centent');
                for (var i = 0; i < genderd.length; i++) {
                    if (genderd[i].checked) {
                        bFlaga = true;
                        break;
                     }
                }
                
                if (bFlaga == false) {
                    alert('类别不能为空，请选择！')
                    return false;
                }

                alert('举报成功!');
                $(".popup-eject").hide(); 
      
            });  
     
            
             //  顶部显示的分数
             $(".score_Show p").each(function(index, element) {
                var num = $(this).attr("tip");
                var www = num*1*.146 + "rem";
                $(this).css("width",www);
                $(this).parent(".score_Show").siblings("span").text(num);
            });

            // 顶部的点赞
            $(".praise").off("click").on('click', function(e){
                // 获取图片id 
                var praise_img = $(this).children(".praise-img");
                // 加一减一的数字
                var text_box = $(this).parent().children(".add-num");
                // 点赞的数量
                var praise_num = $(this).parent().children(".main-fabulous-num");

                if(praise_num.text() == " 赞"){
                    praise_num.text(0);
                }

                // 将数字添加到 id为praise-num的p标签中；
                var num = parseInt(praise_num.text());

                if($(this).attr("data-type") == 'true'){            
                    $(this).html("<img src='./img/favor-small.png' class='animation praise-img' />");
                    praise_num.removeClass("hover");
                    text_box.show().html("<em class='add-animation'>-1</em>");
                    $(this).parent().children(".add-num").children(".add-animation").removeClass("hover");
                    num -=1;
                    praise_num.text(num)
                    $(this).attr("data-type", "false");

                }else{            
                    $(this).html("<img src='img/yizan.png' class='animation praise-img' />");
                    praise_num.addClass("hover");
                    text_box.show().html("<em class='add-animation'>+1</em>");                       
                    $(this).parent().children(".add-num").children(".add-animation").addClass("hover");
                    num +=1;
                    praise_num.text(num);
                    $(this).attr("data-type", "true");
                }

                if(praise_num.text() == 0){                             
                    praise_num.text(" 赞");
                }

                //顶部的点赞的 加签名
                var datad = {
                    bookCommentId:e.currentTarget.dataset.id,//评论id
                    userId:localStorage.getItem('userId'),
                    sourceId:2                                
                }
                var md5 = md5Encryption(datad,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');
                console.log("&bookCommentId=" +e.currentTarget.dataset.id +", &userId=" + localStorage.getItem('userId') +', &sourceId=2'+', &signed='+md5);
             
                console.log( e.currentTarget.dataset.id);
                console.log( e.currentTarget.dataset.type);

                $.ajax({
                    type: 'POST',
                    url: 'https://test.uwooz.com/mxapi/book/addAssist',
                    data:{
                        bookCommentId:e.currentTarget.dataset.id,
                        userId:localStorage.getItem('userId'),
                        sourceId:2,    
                        signed:md5                            
                    },
                    success: function (res) {
                        if(res.errorCode === 200){                          
                            $(this).attr("data-type", "true");                                                       
                            console.log(res.message);

                        }else{
                            $(this).attr("data-type", "false");                                                           
                            console.log(res.message);
                        }                                      
                    }

                })
            });
                   
          

           // 获取元素，设置单击事件
            $('.section-more').off('click').on('click', function(e){
                $(this).children(".section-eject-box").show();
                stopPropagation(e);
            });
            $('.section-close').off("click").on( 'click', function(){
                $(this).parent().parent().hide();                      
            });
            
            $(".section-eject-box").click(function (e) {
                stopPropagation(e);
            })
            
            $(document).bind("click", function(){
                $(".section-eject-box").hide();     
            });

            // 点击打开举报页面
            $('.section-popup-info').off('click').on('click', function(e){
                $(".popup-eject").show();  
            });  
            // 点击关闭举报页面
            $('.return-img').off('click').on('click', function(e){
                $(".popup-eject").hide();  
            });  

            // 点击举报
            $('.section-submission').off('click').on('click', function(e){
                var bFlag = false;

                var gender = document.getElementsByName('type-r');

                var val;
                for(radio in gender) {

                    if(gender[radio].checked) {
                        bFlag = true;
                        val = gender[radio].value;
                        break;
                    }
                }
                if(bFlag == false) {
                    alert('类别不能为空，请选择！')
                    return false;
                }
           
                alert('举报成功!');
                $(this).parent(".popup-eject").hide(); 
                $(this).parent(".popup-eject").empty(); 
            });  

            // 回复评论者的点赞
            $(".section-fabulous-img").off("click").on('click', function(e){
                // 获取图片id 
                var praise_img = $(this).children(".praise-img");
                // 加一减一的数字
                var text_box = $(this).parent().children(".add-num");
                // 点赞的数量
                var praise_txt = $(this).parent().children(".praise-txt");

                if(praise_txt.text() == '赞'){                             
                    praise_txt.text(0);
                }
                // 将数字添加到 为praise-txt的p标签中；
                var num = parseInt(praise_txt.text());
             
                if($(this).attr("data-type2") == 'true'){            
                    $(this).html("<img src='./img/favor-small.png' class='animation praise-img' />");
                    praise_txt.removeClass("hover");
                    text_box.show().html("<em class='add-animation'>-1</em>");
                    $(this).parent().children(".add-num").children(".add-animation").removeClass("hover");
                    num -=1;
                    praise_txt.text(num)
                    $(this).attr("data-type2", "false");

                }else{            
                    $(this).html("<img src='img/yizan.png' class='animation praise-img' />");
                    praise_txt.addClass("hover");
                    text_box.show().html("<em class='add-animation'>+1</em>");                       
                    $(this).parent().children(".add-num").children(".add-animation").addClass("hover");
                    num +=1;
                    praise_txt.text(num);
                    $(this).attr("data-type2", "true");
                }
                if(praise_txt.text() == 0){                             
                    praise_txt.text("赞");
                }
                 // 回复评论者的点赞 加签名
                var datad = {
                    bookCommentId:e.currentTarget.dataset.id2,//评论id
                    userId:localStorage.getItem('userId'),
                    sourceId:2,                                
                }
                var md5 = md5Encryption(datad,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');

                console.log("&bookCommentId=" +e.currentTarget.dataset.id2 +", &userId=" + localStorage.getItem('userId') +', &sourceId=2'+', &signed='+md5);
                console.log( e.currentTarget.dataset.id2);
                console.log( e.currentTarget.dataset.type2);

                $.ajax({
                    type: 'POST',
                    url: 'https://test.uwooz.com/mxapi/book/addAssist?',
                    data: "bookCommentId=" + e.currentTarget.dataset.id2 +"&userId=" + localStorage.getItem('userId') +'&sourceId=2'+'&signed='+md5,
                    
                    success: function (res) {
                        if(res.errorCode === 200){                          
                            $(this).attr("data-type", "true");                                                       
                            console.log(res.message);

                        }
                        if(res.errorCode === 201){
                            $(this).attr("data-type", "false");                                                                   
                            console.log(res.message);
                        }  
                    }
            
                })
            });

            // 回复的条数
            $('.replyNumber span').prepend(fabulous); 

          
            

        },

        error: function(error){
            alert('页面加载出错，请刷新重试！');    
        }
    })

    // 回复评论
    $('#sendOut').on('click', function(e){
        var content = $("#inpinfo").val();
  
        if (content === '') {
            alert('内容不能为空!');
            return;
        }

        //加签名
        var data = {
            content:content,
            bookCoreId:localStorage.getItem('bookKey'),
            reguseId:localStorage.getItem('userInfo'),//评论人的id
            userId: localStorage.getItem('userId'),
            sourceId:2,
            type:commentId//评论id
        }

        var md5 = md5Encryption(data,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');
        console.log(md5);
  
        
        $.ajax({
            type: "POST",
            url: "https://test.uwooz.com/mxapi/book/addComment",           
            data:{
                content:content,
                bookCoreId:localStorage.getItem('bookKey'),
                reguseId:localStorage.getItem('userInfo'),
                userId: localStorage.getItem('userId'),
                sourceId:2,
                type:commentId,
                signed:md5
            },
    
            success: function (msg) {

                if (msg.errorCode === 200) {
                    console.log('评论成功！');
                    window.location.reload();
                }else{
                    console.log('评论失败！');   
                }        
                       
    
            },
    
            error: function(error){
                alert('页面加载出错，请刷新重试！');    
            }
        })
    
    });

});























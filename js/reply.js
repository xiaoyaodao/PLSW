
$(document).ready(function () {
    var search = location.search;//获取评论人的id
    var commentData = search.slice(1);//获取到id
    var commentId = commentData.split('=')[1]; //获取到id值

    console.log(search);
    console.log(commentData);
    console.log(commentId);

    //加签名
    var data = {
        id:localStorage.getItem('bookKey'),
        sourceId:2,
        userId:localStorage.getItem('userKey')      
    }

    var md5 = md5Encryption(data,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');


    $.ajax({
        type: "POST",
        // url: "https://test.uwooz.com/mxapi/book/getBookInfo?id=1&sourceId=1&signed=0f5978148420a96013e6ec0494b8e18c",
        url: "https://test.uwooz.com/mxapi/book/getBookInfo?",
        data: 'id=' +localStorage.getItem('bookKey')+ '&userId=' +localStorage.getItem('userKey') + '&sourceId=2' + '&signed='+md5,


        success: function (msg) {
            var data = msg.data;
          
            var commentNode = '';
            var fabulous = '';
            var replyDataNode = '';
            var userInfo = '';

            
            for(var i = 0; i < data.bookCommentList.length; i++){

                var datas = data.bookCommentList[i];

                 console.log(datas);                
                              
                
                if(datas.id == commentId){
                        
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
                                    <span></span>\
                                </div>\
                            </div>\
                            <div class="main-more">\
                                <img src="./img/spot-h.png" alt="">\
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
                                    <div class="main-fabulous-img praise">\
                                        <img src="./img/favor-small.png" class="praise-img">\
                                    </div>\
                                    <!-- 点赞的数量 -->\
                                    <p class="main-fabulous-num praise-txt"> '+datas.assistCount+' </p>\
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

                        
                    for(var b = 0; b < datas.bookReplyList.length; b++){
                        var replyData =  datas.bookReplyList[b];
                                            
                        // console.log(datas.bookReplyList.length);                       
                        console.log(replyData);
                        // console.log(replyData.userInfo.id);

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
                                <div class="section-more">\
                                    <img src="./img/spot-h.png" alt="">\
                                </div> \
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
                                        <div class="section-fabulous-img">\
                                            <img src="./img/favor-small.png" class="praise-img">\
                                        </div>\
                                        <!-- 点赞的数量 -->\
                                        <p class="section-fabulous-num praise-txt" >'+replyData.assistCount+'</p>\
                                        <span class="add-num"><em>+1</em></span>\
                                    </div>\
                                </div>\
                            </div> \
                        </div>\
                        '
                    }
                    // console.log(fabulous)  
                    fabulous+=datas.bookReplyList.length;
                    userInfo+=datas.userInfo.id;
                    localStorage.setItem('userInfo', userInfo);
                    
                } 
                         
            }


            $('.main-comment-info').append(commentNode);

             // 显示分数
             $(".score_Show p").each(function(index, element) {
                var num = $(this).attr("tip");
                var www = num*1*.14 + "rem";
                $(this).css("width",www);
                $(this).parent(".score_Show").siblings("span").text(num);
            });
            // 点赞
            $(".praise").click(function(){
                // 获取图片id 
                var praise_img = $(this).children(".praise-img");
                // 加一减一的数字
                var text_box = $(this).parent().children(".add-num");
                // 点赞的数量
                var praise_txt = $(this).parent().children(".praise-txt");
                // 将数字添加到 id为praise-txt的p标签中；
                var num = parseInt(praise_txt.text());

                // console.log(text_box)

                if(praise_img.attr("src") == ("img/yizan.png")){            
                    $(this).html("<img src='./img/favor-small.png' class='animation praise-img' />");
                    praise_txt.removeClass("hover");
                    text_box.show().html("<em class='add-animation'>-1</em>");
                    $(this).parent().children(".add-num").children(".add-animation").removeClass("hover");
                    num -=1;
                    praise_txt.text(num)
                }else{            
                    $(this).html("<img src='img/yizan.png' class='animation praise-img' />");
                    praise_txt.addClass("hover");
                    text_box.show().html("<em class='add-animation'>+1</em>");                       
                    $(this).parent().children(".add-num").children(".add-animation").addClass("hover");
                    num +=1;
                    praise_txt.text(num)
                }
            });
            
            //  回复评论者的内容详情
            $('section').append(replyDataNode);

            // 回复评论者的点赞
            $(".section-fabulous-img").click(function(){
                // 获取图片id 
                var praise_img = $(this).children(".praise-img");
                // 加一减一的数字
                var text_box = $(this).parent().children(".add-num");
                // 点赞的数量
                var praise_txt = $(this).parent().children(".praise-txt");
                // 将数字添加到 为praise-txt的p标签中；
                var num = parseInt(praise_txt.text());

                if(praise_img.attr("src") == ("img/yizan.png")){            
                    $(this).html("<img src='./img/favor-small.png' class='animation praise-img' />");
                    praise_txt.removeClass("hover");
                    text_box.show().html("<em class='add-animation'>-1</em>");
                    $(this).parent().children(".add-num").children(".add-animation").removeClass("hover");
                    num -=1;
                    praise_txt.text(num)
                }else{            
                    $(this).html("<img src='img/yizan.png' class='animation praise-img' />");
                    praise_txt.addClass("hover");
                    text_box.show().html("<em class='add-animation'>+1</em>");                       
                    $(this).parent().children(".add-num").children(".add-animation").addClass("hover");
                    num +=1;
                    praise_txt.text(num)
                }
            });

            // 回复的条数
            $('.replyNumber span').prepend(fabulous); 

          
            

        },




        error: function(error){
            alert('页面加载出错，请刷新重试！');    
        }
    })

 $('#sendOut').click(function (e) {   
    var content = $("input").val();
  
    if (content === '') {
      alert('内容不能为空!');
      return;
    }

    //加签名
    var data = {
        content:content,
        bookCoreId:localStorage.getItem('bookKey'),
        reguseId:localStorage.getItem('userInfo'),//评论人的id
        userId: localStorage.getItem('userKey'),
        sourceId:2,
        type:commentId//评论id
    }

    var md5 = md5Encryption(data,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');
    console.log(md5);

   $.ajax({
            type: "POST",
            url: "https://test.uwooz.com/mxapi/book/addComment?",
            data: "content=" + content + "&bookCoreId=" + localStorage.getItem('bookKey') +"&userId=" + localStorage.getItem('userKey') +"&reguseId=" +localStorage.getItem('userInfo') + "&type=" +commentId + "&sourceId=2"+"&signed="+ md5,
    
    
            success: function (msg) {

                if (msg.errorCode === 200) {
                    alert('评论成功！');
                        // 跳转 相当于刷新
                        // location.assign('./reply.html');  
                }else{
                    alert('评论失败！');   
                }        
                       
    
            },
    
            error: function(error){
                alert('页面加载出错，请刷新重试！');    
            }
        })
    
    });

});























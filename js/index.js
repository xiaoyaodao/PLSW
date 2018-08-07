
$(document).ready(function () {

    var search = location.search;
    var data = search.slice(1);

    var bookCoreId = data.split('&')[0];
    var bookKey = bookCoreId.split('=')[1];

    var code = data.split('&')[1];
    var userKey = code.split('=')[1];
    
    console.log(search);
    console.log(data);

    console.log(bookCoreId);
    console.log(bookKey);

    console.log(code);  
    console.log(userKey);
    
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
                }
            }

        }
    })

 //加签名
    var data = {
        userId:localStorage.getItem('userKey'),
        sourceId:2, 
        id:localStorage.getItem('bookKey')
    }

    var md5 = md5Encryption(data,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');

    $.ajax({
        type: "POST",
        url: "https://test.uwooz.com/mxapi/book/getBookInfo?",
        data: "",
        data:'&userId=' + localStorage.getItem('userKey')+ '&id=' +  localStorage.getItem('bookKey')+'&sourceId=2' + "&signed="+ md5, 

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
                var www = num*1* .24 + "rem";
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

            // 书的评论
            console.log(data.bookCommentList);
            
            var comment = '';
            for(var i = 0; i<data.bookCommentList.length; i++){
                var datas = data.bookCommentList[i];

                // console.log(datas.id);
                // console.log(datas.userAssist);
                
                comment+='\
                    <div class="article-comment-info">\
                        <div class="article-top" data-info = '+datas.userInfo+' >\
                            <!-- 头像 -->\
                            <div class="article-headPortrait">\
                               '+ (datas.userInfo !== null ? '<img src="'+datas.userInfo.headimgurl+'" alt=""/>' :  '<img src="./img/logo.png" alt=""/>') +'\
                            </div>\
                            <!-- 评分相关信息 -->\
                            <div class="article-recollections">\
                                <!-- 评论者昵称 -->\
                                <p class="article-recollections-title">\
                                    '+ (datas.userInfo !== null ? datas.userInfo.nickname :  '我忘了...')+'\
                                </p>\
                                <div class="article-recollections-score clearfix">\
                                    <div class="score_Show">\
                                        <p tip="'+datas.grade+'"></p>\
                                    </div>\
                                    <span></span>\
                                </div>\
                            </div>\
                            <!-- 跳转到评论详情页 -->\
                            <div class="article-more">\
                                <a href="javascript:void(0);">\
                                    <img src="./img/spot-h.png" alt="">\
                                </a>\
                            </div>\
                        </div>\
                        <div class="article-content">\
                            <!-- 评论内容 -->\
                            <p class="article-content-info">\
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
                                    <div class="article-fabulous-img  praise" data-id="'+datas.id+'" data-type ="'+datas.userAssist+'">\
                                        <img src="./img/favor-small.png" class="praise-img">\
                                    </div>\
                                    <!-- 点赞的数量 -->\
                                    <p class="article-fabulous-num praise-txt" >'+datas.assistCount+'</p>\
                                    <span class="add-num"><em>+1</em></span>\
                                </div>\
                                <!-- 回复条数 -->\
                                <div class="article-bottom-comment" data-id="'+datas.id+'">\
                                    <div class="article-comment-img">\
                                        <img src="./img/comment-small.png" alt="">\
                                    </div>\
                                    <p class="article-comment-num">'+datas.bookReplyList.length+'</p>\
                                </div>\
                            </div>\
                        </div>\
                    </div> \
                ' 
                // console.log(datas.userInfo)            
            }
            $('article').append(comment);


           
             // 显示分数
             $(".score_Show p").each(function(index, element) {
                var num = $(this).attr("tip");
                var www = num*1*.14 + "rem";
                $(this).css("width",www);
                $(this).parent(".score_Show").siblings("span").text(num);
            });

            // 点赞
            $(".praise").click(function(e){
                // 获取图片id 
                var praise_img = $(this).children(".praise-img");
                // 加一减一的数字
                var text_box = $(this).parent().children(".add-num");
                // 点赞的数量
                var praise_txt = $(this).parent().children(".praise-txt");
                // 将数字添加到 id为praise-txt的p标签中；
                var num = parseInt(praise_txt.text());       
                
                if(praise_img.attr("src") == ("img/yizan.png")){            
                    $(this).html("<img src='./img/favor-small.png' class='animation praise-img' />");
                    praise_txt.removeClass("hover");
                    text_box.show().html("<em class='add-animation'>-1</em>");
                    // $(this).parent().children(".add-num").children(".add-animation").removeClass("hover");
                    num -=1;
                    praise_txt.text(num)
                }else{            
                    $(this).html("<img src='img/yizan.png' class='animation praise-img' />");
                    praise_txt.addClass("hover");
                    text_box.show().html("<em class='add-animation'>+1</em>");                       
                    // $(this).parent().children(".add-num").children(".add-animation").addClass("hover");
                    num +=1;
                    praise_txt.text(num)
                    
                }

                //加签名
                var datad = {
                    bookCommentId:e.currentTarget.dataset.id,//评论id
                    userId:localStorage.getItem('userKey'),
                    sourceId:2,                                
                }
                var md5 = md5Encryption(datad,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');

                console.log("&bookCommentId=" +e.currentTarget.dataset.id +"&userId=" + localStorage.getItem('userKey') +'&sourceId=2'+'&signed='+md5);
                console.log( e.currentTarget.dataset.id);
                console.log( e.currentTarget.dataset.type);

                $.ajax({
                    type: 'POST',
                    url: 'https://test.uwooz.com/mxapi/book/addAssist?',
                    data: "bookCommentId=" + e.currentTarget.dataset.id +"&userId=" + localStorage.getItem('userKey') +'&sourceId=2'+'&signed='+md5,
                    
                    success: function (res) {
                        if(res.errorCode === 200){                          
                            $(this).attr("data-type", "true");
                            alert(res.message);

                        }else{
                            $(this).attr("data-type", "false");
                            alert(res.message);
                        }
                      

                        
                    }
            
                })

             
            });

            // 各评分所占的百分比
            $('.star-5').css("width",data.proportion5 +"%");
            $('.star-4').css("width",data.proportion4 +"%");
            $('.star-3').css("width",data.proportion3 +"%");
            $('.star-2').css("width",data.proportion2 +"%");
            $('.star-1').css("width",data.proportion1 +"%");


               // 跳转到评论详情页 
            $('.article-bottom-comment').on('click', function(event){
                location.assign('./reply.html?id=' + event.currentTarget.dataset.id);
            });   


          
        },
      
        error: function(error){
            alert('页面加载出错，请刷新重试！');    
        }
        
    })


   
//     if($('.header-details').text()===''){
//         $('main').empty();
//         $('main').append("<div class='loadding'></div>");
//    }




    // 跳转到评论详
    $('footer').on('click', function(event){
        location.assign('./comment.html');
    });   

});

























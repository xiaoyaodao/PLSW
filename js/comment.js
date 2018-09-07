
$(document).ready(function () {
  // Url传递中文参数乱码 的Js函数解决方法（接受页面引入）
  function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
  }

  function getUrlVar(name){
        return getUrlVars()[name];
  }

  /* 接收参数页面 的两个参数*/
  //获取url
  var urlinfo = window.location.href;
  //拆分url得到userName參數值
  var userName = getUrlVar('userName');

  console.log(decodeURI(userName));
  //网页标题
  $("title").html(decodeURI(userName));


  $('.footer-content').click(function () {
       
      var content = $("#textareas").val();
      var grade = $(".fenshu").text();
      

      if (content === '') {
        alert('内容不能为空!');
        return;
      }
      if (grade === '0.0') {
        alert('评分不能为空!');
        return;
      }

    
     //加签名
     var data = {
                content:content,
                bookCoreId:localStorage.getItem('bookKey'),
                userId: localStorage.getItem('userId'),
                grade:grade,
                sourceId:2
         }

     var md5 = md5Encryption(data,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');
     console.log(md5);


        $.ajax({
            type: "POST",
            url: "https://test.uwooz.com/mxapi/book/addComment",
            data:{
                content:content,
                bookCoreId:localStorage.getItem('bookKey'),
                userId: localStorage.getItem('userId'),
                grade:grade,
                sourceId:2,
                signed:md5
            },
    
            success: function (msg) {

                if (msg.errorCode === 200) {
                    location.assign('./index.html');    
                        
                }else{
                   return;    
                }        
            },
    
            error: function(error){
                alert('页面加载出错，请刷新重试！');    
            }
        })
    
      
  });
    
});
    
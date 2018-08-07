// textareas 高度自适应;
var autoTextarea = function (elem, extra, maxHeight) {
extra = extra || 0;
var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
        addEvent = function (type, callback) {
                elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
        },
        getStyle = elem.currentStyle ? function (name) {
                var val = elem.currentStyle[name];

                if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                                parseFloat(getStyle('paddingTop')) -
                                parseFloat(getStyle('paddingBottom')) + 'px';        
                };

                return val;
        } : function (name) {
                        return getComputedStyle(elem, null)[name];
        },
        minHeight = parseFloat(getStyle('height'));

elem.style.resize = 'none';

var change = function () {
        var scrollTop, height,
                padding = 0,
                style = elem.style;

        if (elem._length === elem.value.length) return;
        elem._length = elem.value.length;

        if (!isFirefox && !isOpera) {
                padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
        };
        scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        elem.style.height = minHeight + 'px';
        if (elem.scrollHeight > minHeight) {
                if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                };
                style.height = height + extra + 'px';
                scrollTop += parseInt(style.height) - elem.currHeight;
                document.body.scrollTop = scrollTop;
                document.documentElement.scrollTop = scrollTop;
                elem.currHeight = parseInt(style.height);
        };
};

        addEvent('propertychange', change);
        addEvent('input', change);
        addEvent('focus', change);
        change();
};

$(document).ready(function () {


  $('.footer-content').click(function () {
       
      var content = $("#textareas").val();
      var grade = $(".fenshu").text();


      if (content === '') {
        alert('内容不能为空!');
        return;
      }
      if (grade === '') {
        alert('评分不能为空!');
        return;
      }

     console.log("content=" + content + "&grade=" + grade + "&bookCoreId=1"+"&userId=1033439")
     //加签名
     var data = {
                content:content,
                bookCoreId:localStorage.getItem('bookKey'),
                userId: localStorage.getItem('userKey'),
                grade:grade,
                sourceId:2
         }

     var md5 = md5Encryption(data,'kB50erIyBe3ci4R7fsuyWuX4Raq7OGMv');
     console.log(md5);


        $.ajax({
            type: "POST",
            url: "https://test.uwooz.com/mxapi/book/addComment?",
            data: "content=" + content +"&bookCoreId=" + localStorage.getItem('bookKey') +"&userId="+ localStorage.getItem('userKey') + "&grade=" + grade+ "&sourceId=2"+"&signed="+ md5,
    
    
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
    
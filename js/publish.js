function fileSelected() {
  var iMaxFilesize = 5 * 1024 * 1024;
  var oFile = document.getElementById('imageFile').files[0];
  var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/jpg|image\/png|image\/tiff)$/i;
  
  if (!rFilter.test(oFile.type)) {
    alert("鏂囦欢鏍煎紡蹇呴』涓哄浘鐗�");
    return;
  }
  if (oFile.size > iMaxFilesize) {
    alert("浣滃搧澶у皬涓嶈兘瓒呰繃5M");
    return;
  }
  var formData = new FormData();
  formData.append("upfile", document.getElementById("imageFile").files[0]);
  
  $('#imageFile').attr('disabled', 'disabled');

  $.ajax({
    url: "http://api.qqmmsh.com/mxoms/uploade/file.do",
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    cache: false,
    success: function (data) {
      $('#imageFile').removeAttr('disabled', 'disabled');
      var data = eval('(' + data + ')');

      if (data.status) {
        $("#fileurl").val(data.url);
        alert("浣滃搧涓婁紶鎴愬姛锛�");
      } else {
        alert('浣犲彲浠ョ偣鍑绘寜閽噸鏂颁笂浼�');
      }
    },
    error: function () {
      $('#uploadBtn').html('涓婁紶浣滃搧澶辫触锛岃閲嶈瘯锛�');
    }
  }, "json");
};

function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

// 对参数排序
function sortToMap(map) {
  var arr = [];
  for (var key in map) {
    arr.push(key);
  }
  arr.sort();
  return arr;
}

//对参数拼接成 XXX=XXX&XXX==XXXX 字符串的形式 后再进行加密
function sign(arr2, map) {
  var str = "";
  for (var i = 0; i < arr2.length; i++) {
    if (map[arr2[i]] == null || map[arr2[i]] == "" || map[arr2[i]] == undefined) {
      continue;
    }
    str += arr2[i] + "=" + map[arr2[i]] + "&";
  }
  str = str.substring(0, str.length - 1);
  return str;
}

// 对签名进行md5加密
function md5Encryption(obj, subkey) {
  let map = sortToMap(obj);
  let str1 = sign(map, obj);
  let key = Object.keys(obj).sort();
  let data = '';
  for (let i = 0; i < key.length; i++) {
    data += key[i];
  }
  let md51 = hex_md5(`${str1}${subkey}`);
  return (md51);
}
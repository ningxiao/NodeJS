var url = require("url");
/**
 * 广告请求中心
 * @param handle 处理对象
 * @param pathname 路由key
 */
function adscenter(request,response) {
  var data = url.parse(request.url,true),query = data.query;
  var adsxml = "";
  switch(query.adtype){
    case "1":
        adsxml = "/ads/xml/xml_1.xml";
      break;
    case "2":
        if(query.btm=="1"){
            adsxml = "/ads/xml/xml_3.xml";
        }else{
            adsxml = "/ads/xml/xml_2.xml";
        }
      break;
    default:
  }
  return adsxml;
}
module.exports = {'adscenter':adscenter};
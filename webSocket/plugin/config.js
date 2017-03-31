var plugins = require("./plugins.js");
exports.Expires = {
  fileMatch: /^(gif|png|jpg|js|css)$/ig,
  maxAge: 60*60*24*365
};
exports.Filter = {
  "static.hd.baofeng.com":/\_(.[\d_]+?)\./ig
}
exports.Compress = {
    match: /css|js|html/ig
};
exports.Welcome = {
    file: "index.html"
};
exports.routerMap = {
    "/Consultation/index.php": plugins.adscenter
};
exports.Mime = {  
  "css": "text/css",  
  "gif": "image/gif",  
  "html": "text/html",  
  "ico": "image/x-icon",  
  "jpeg": "image/jpeg",  
  "jpg": "image/jpeg",  
  "js": "text/javascript",  
  "json": "application/json",  
  "pdf": "application/pdf",  
  "png": "image/png",  
  "svg": "image/svg+xml",  
  "swf": "application/x-shockwave-flash",  
  "tiff": "image/tiff",  
  "txt": "text/plain",  
  "wav": "audio/x-wav", 
  "mp4": "video/mp4", 
  "wma": "audio/x-ms-wma",  
  "wmv": "video/x-ms-wmv",  
  "xml": "text/xml",
  "flv": "flv-application/octet-stream",
  "appcache": "text/cache-manifest",
  "manifest": "text/cache-manifest"  
}; 
var qs = require('querystring');
function hello() {
    console.log(qs.parse('foo=bar&baz=qux&baz=quux&corge'));
    var str = encodeURIComponent('foo=bar&baz=qux&baz=quux&corge');
    console.log(str,decodeURIComponent(str));
}
hello();
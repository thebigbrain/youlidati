var express = require('express');
var request = require('request');
var app = express();

app.use('/api', function(req, res) {
  console.log(req.url);
    var url = 'http://xxyltest.zbfuhua.com/' + req.url;
    req.pipe(request(url)).pipe(res);
});

app.use(express.static('./'));

app.listen(3000, () => {
  console.log('started @', 3000)
}); 
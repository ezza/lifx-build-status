var express    = require('express');
var fs         = require('graceful-fs');
var bodyParser = require('body-parser')

var lifx          = require('./lib/lifx');
var secretsLoader = require('./lib/secrets-loader');

global.secrets = secretsLoader(__dirname + '/secrets.json');

var app = express();

// https://github.com/expressjs/body-parser#bodyparserjsonoptions
app.use(bodyParser.json({
  limit:  '100kb',
  strict:  true
}));

app.post('/', function(req, res) {
  var event = req.get('X-GitHub-Event');
  if (!event) {
    return fail(res, 'Not a valid webhook request');
  }

  lifx(event, req.body);
  res.end();
});

const PORT = process.env.PORT || 9999;

var server = app.listen(PORT, function () {
  var name = require('./package.json').name;
  var host = server.address().address;
  console.log('%s is listening at http://%s:%s', name, host, PORT);
});


function fail(res, reason) {
  res.writeHead(422, reason);
  res.end()
}

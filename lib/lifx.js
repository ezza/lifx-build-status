var format   = require('sprintf-js').sprintf;
var fetch    = require('node-fetch');
var FormData = require('form-data');

var baseColor = 'white brightness:0';

const Brightness = {
  High: ' brightness:1',
  Low:  ' brightness:0.3'
}
const Color = {
  Blue:  'blue',
  Red:   'red',
  Green: 'green'
}

function lifx(event, data) {
  console.log('Incoming webhook for: ' + event);

  if (event == 'pull_request') {
    flash(Color.Blue + Brightness.Low);
  }
  if (event == 'status' && data.context == 'ci/circleci') {
    var defaultBranch = data.branches.some(function(b) {
      return b.name == secrets.defaultBranch;
    });

    switch (data.state) {
      case 'failure':
        if (defaultBranch) {
          pulsate(Color.Red + Brightness.High, true);
        } else {
          flash(Color.Red + Brightness.Low);
        }
        break;

      case 'success':
        if (defaultBranch) {
          flash(Color.Green + Brightness.High);
        } else {
          flash(Color.Green + Brightness.Low);
        }
        break;
    }
  }
}

module.exports = lifx;

// COMMANDS

function flash(color) {
  var form = new FormData();
  form.append('color', color.trim());
  form.append('from_color', baseColor);

  return request('effects/breathe', form, color);
}

function pulsate(color, persist) {
  var form = new FormData();
  form.append('color', color.trim());
  form.append('from_color', baseColor);
  form.append('cycles', 5);
  form.append('persist', String(!!persist));

  return request('effects/breathe', form, color);
}

// GENERICS

var requestCount = 0;

function request(command, form, color) {
  var prefix = format('LIFX API %04d %s(%s):', ++requestCount, command, color);
  var url = format('https://api.lifx.com/v1beta1/lights/%s/%s', secrets.lifx.selector, command);

  console.info('%s Requesting...', prefix);

  var headers = form.getHeaders();
  headers.Authorization = 'Bearer ' + secrets.lifx.token;

  var methods = {
    'effects/breathe': 'POST',
    'power':           'PUT',
    'color':           'PUT'
  };

  var options = {
    method: methods[command],
    body: form,
    headers: headers
  };

  return fetch(url, options)
    .then(status)
    .then(json)
    .then(function(json) {
      console.info('%s OK', prefix);
      // console.dir(json);
    })
    .catch(function(err) {
      console.error('%s %s', prefix, err);
      // console.dir(err)
    });
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // console.dir(response)

  var err = new Error(response.statusText);
  err.body = response.json()

  throw err
}

function json(response) {
  return response.json()
}

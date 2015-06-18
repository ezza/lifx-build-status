
module.exports = function(filename) {
  try {
    var data = require(filename);
  } catch (e) {
    throw new Error(filename + ' could not be loaded.');
  }

  validate(data, 'defaultBranch');
  validate(data, 'lifx.token');
  validate(data, 'lifx.selector');

  return data;
}

function validate(data, objpath) {
  var paths = objpath.split('.');
  var parent = data;
  var part;
  while (part = paths.shift()) {
    if (!(part in parent)) {
      throw new Error('Required secret: ' + objpath);
    }
    parent = parent[part];
  }
}

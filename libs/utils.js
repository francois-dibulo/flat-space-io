var Utils = {};

/**
 * Returns random string which can be used for ids
 * @return {String}
 */
Utils.randomId = function(chars) {
  chars = chars || 15;
  return (Math.random() + 1).toString(36).substring(2, chars);
};

/**
 * Returns random integer between two numbers
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
Utils.random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) +min);
};

/**
 * Swaps two elements in an array
 * @param {Array} arr
 * @param {Number} target_index
 * @param {Number} source_index
 */
Utils.swapArrayElements = function(arr, target_index, source_index) {
  var temp = arr[target_index];
  arr[target_index] = arr[source_index];
  arr[source_index] = temp;
};

/**
 * Returns value of a nested object by a specified path
 * @param {Object} obj
 * @param {String} path - E.g. "parent.sub.color"
 * @return {String}
 */
Utils.getValueByString = function(obj, path) {
  var separator = '.';
  var properties = Utils.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
};

/**
 * Returns True if passed argument is of type Array
 * @param {Mixed} arg
 * @return {Boolean}
 */
Utils.isArray = function(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
};

/**
 * Capitalizes the first character of a string
 * @param {String} text
 * @return {String}
 */
Utils.capitalize = function(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Loads images - passes True in the callback's second argument
 * as soon as all images have been loaded.
 * @param {String} base_path - The base path of all dirs and files
 * @param {Object} files_map - Map of dirs and files. E.g. { icons: ['1.png', 'done.png'] }
 * @param {Function} Callback function (Percentage<Number>, Completed<Boolean>)
 */
Utils.preloadAssets = function(base_path, files_map, cb) {
  var total_files = 0;
  var loaded = 0;
  var has_cb = typeof cb === "function";

  var onImgLoaded = function() {
    loaded++;
    var percent = Math.round(loaded / total_files * 100);
    if (has_cb) {
      cb(percent, loaded >= total_files);
    }
  };

  // Get total amount of files to load
  for (var dir in files_map) {
    var files = files_map[dir];
    total_files += files.length;
  }

  // Load images
  for (var dir in files_map) {
    var files = files_map[dir];
    for (var i = 0; i < files.length; i++) {
      var img_src = base_path + dir + "/" + files[i];
      var img = new Image();
      img.onload = onImgLoaded();
      img.src = img_src;
    }
  }
};

Utils.getPosOnRadius = function(point, radius, angle) {
  return {
    x: point.x + Math.cos(angle) * radius,
    y: point.y + Math.sin(angle) * radius
  };
};

Utils.angleReflect = function(incidenceAngle, surfaceAngle) {
  var a = surfaceAngle * 2 - incidenceAngle;
  return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
};

module.exports = {
  truncate: function (string, len) {
    if (string.length > len && string.length > 0) {
      let newString = string + "";
      newString = string.substr(0, len);
      newString = string.substr(0, newString.lastIndexOf(" "));
      newString = newString.length > 0 ? newString : string.substr(0, len);
      return newString + "...";
    }
    return string;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
};

//

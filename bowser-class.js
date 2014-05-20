/**
 * By Anders Johnson
 * Adds classes to HTML element indicating IE version. Useful for CSS hacks.
 * Alternative to:
 *  * http://www.paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/
 *  * http://mathiasbynens.be/notes/safe-css-hacks
 */
(function (root, factory) {
  var name = 'BowerClass';
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'bowser'], factory);
  }
  else {
    root[name] = factory(jQuery, bowser);
  }
})(this, function ($, bowser) {


  var out = {};


  var defaultOptions = {
    bowser: bowser, // expose ability to stub bowser
    ieMaxVersion: 11, // add classes up to IE 10,
    ieMinVersion: 6, // add classes down to IE 6,
    /**
     * operators: ['gt', 'lt', 'gte', 'lte']
     * default output example: 'lt-ie9'
     * matches HTML5 Boilerplate v4's IE-specific classes
     */
    makeClass: function (browser, version, operator) {
      return operator + '-' + browser + version;
    },
    signature: false // signature class to add, if any, for traceability
  };


  var BowserClass = function (options) {
    this.options = $.extend(true, {}, defaultOptions, options);

    this.bowser = options.bowser;

    this.$element = options.element ? $(options.element) : $(document.documentElement);

    return this;
  };


  /**
   * Generates classes for IE version, e.g. "ie8 lte-ie8 lt-ie9 lt-ie10 ..." for IE8.
   * 
   * "lt": less than
   * 
   * @param version
   * @return {Array} classes
   */
  BowserClass.prototype.getClassesForIE = function (version) {
    var classes = [];

    if (this.options.signature) {
      classes.push(this.options.signature);
    }

    // safe transform string to to integer - e.g. "11.2" -> 11
    try {
      var intVersion = parseInt(parseFloat(version).toFixed(0));
    }
    catch (e) {
      // silent fail
      return ['ie'];
    }
    classes.push('ie' + intVersion);

    var clazz;
    var lt;
    for ( lt = intVersion + 1; lt <= this.options.ieMaxVersion; ++lt ) {
      clazz = this.options.makeClass('ie', lt, 'lt');
      classes.push(clazz);
    }
    var gt;
    for ( gt = intVersion - 1; gt >= this.options.ieMinVersion; --gt ) {
      clazz = this.options.makeClass('ie', gt, 'gt');
      classes.push(clazz);
    }
    return classes;
  };


  BowserClass.prototype.getClasses = function () {
    return this.getClassesForIE(this.bowser.version);
  };


  BowserClass.prototype.addClasses = function () {
    var _this = this;
    // only on IE for now...
    if (this.bowser.msie) {
      var classes = this.getClasses();
      $.each(classes, function (i, clazz) {
        _this.$element.addClass(clazz);
      });
    }
  };


  BowserClass.init = function (options) {
    var instance = new BowserClass(options);
    instance.addClasses();
    return instance;
  };


  return BowserClass;

});

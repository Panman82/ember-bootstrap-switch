/* jshint node: true */
'use strict';


// module requirements
var fs = require('fs');


module.exports = {
  name: 'ember-bootstrap-switch',


  included: function(app, parentAddon) {

    // Per the ADDON_HOOKS.md document
    // https://github.com/ember-cli/ember-cli/blob/master/ADDON_HOOKS.md#included
    this._super.included.apply(this, arguments);


    // Per the ember-cli documentation
    // http://ember-cli.com/extending/#broccoli-build-options-for-in-repo-addons
    var target = (parentAddon || app);


    // Addon options from the apps ember-cli-build.js
    var options = target.options[this.name] || {};


    // Version of bootstrap-switch to use
    options.boostrapVersion = options.bootstrapVersion || 3;


    // Path to bootstrap-switch in bower
    var bootstrapSwitchPath    = target.bowerDirectory  + '/bootstrap-switch/dist';
    var bootstrapSwitchCssPath = bootstrapSwitchPath + '/css/bootstrap' + options.boostrapVersion;


    // Make sure bootstrap-switch is available
    if (!fs.existsSync(bootstrapSwitchPath)) {
      throw new Error(
        this.name + ': bootstrap-switch is not available from bower (' + bootstrapSwitchPath + '), ' +
        'install into your project by running `bower install bootstrap-switch --save`'
      );
    }


    // Make sure bootstrap-switch css is available
    if (!options.excludeCSS && !fs.existsSync(bootstrapSwitchCssPath)) {
      throw new Error(
        this.name + ': bootstrap-switch css version is not available from bower (' + bootstrapSwitchCssPath + '), ' +
        'if you specify the `bootstrapVersion` be sure it is a valid option (currently 2 or 3)'
      );
    }


    // Import bootstrap-switch js
    if (!options.excludeJS) {
      target.import({
        development: bootstrapSwitchPath + '/js/bootstrap-switch.js',
        production:  bootstrapSwitchPath + '/js/bootstrap-switch.min.js'
      });
    }


    // Import bootstrap-switch css
    if (!options.excludeCSS) {
      target.import({
        development: bootstrapSwitchCssPath + '/bootstrap-switch.css',
        production:  bootstrapSwitchCssPath + '/bootstrap-switch.min.css'
      });
    }


  } // :included


}; // module.exports

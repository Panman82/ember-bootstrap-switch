/* jshint node: true */
'use strict';


// module requirements
var fs = require('fs');


module.exports = {
  name: 'ember-bootstrap-switch',


  included: function(app) {


    // Path to bootstrap-switch in bower
    var bootstrapSwitchPath = app.bowerDirectory + '/bootstrap-switch/dist';


    // Make sure bootstrap-switch is available
    if (!fs.existsSync(bootstrapSwitchPath)) {
      throw new Error(
        this.name + ': bootstrap-switch is not available from bower (' + bootstrapSwitchPath + '), ' +
        'install into your project by `bower install bootstrap-switch --save`'
      );
    }


    // Import bootstrap-switch js
    app.import({
      development: bootstrapSwitchPath + '/js/bootstrap-switch.js',
      production:  bootstrapSwitchPath + '/js/bootstrap-switch.min.js'
    });


    // Import bootstrap-switch css
    app.import({
      development: bootstrapSwitchPath + '/css/bootstrap3/bootstrap-switch.css',
      production:  bootstrapSwitchPath + '/css/bootstrap3/bootstrap-switch.min.css'
    });


  } // :included


}; // module.exports

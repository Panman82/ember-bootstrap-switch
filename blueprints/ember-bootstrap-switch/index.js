module.exports = {
  description: 'Add bower dependency for bootstrap-switch to the project',

  normalizeEntityName: function() {
    // allows us to run ember -g ember-bootstrap-switch and not blow up
    // because ember cli normally expects the format
    // ember generate <entitiyName> <blueprint>
  }, // :normalizeEntityName

  afterInstall: function(options) {
    return addon.addBowerPackageToProject('bootstrap-switch', '^3.3.1');
  } // :afterInstall

};

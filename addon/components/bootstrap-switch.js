import Ember from 'ember';




// Helper to help determine a values truthlyness
// Based on the jQuery's list of truthly and falsely things;
// http://learn.jquery.com/javascript-101/conditional-code/#truthy-and-falsy-things
var isTruthy = function(value) {

  // Conditions that JavaScript considers truthy
  // but would typically be considered falsy
  if (value === 'false' ||
    value === '0' ||
    value === [] ||
    value === {}
  ) {
    return false;
  }

  // Let JavaScript decide
  return !!value;

}; // isTruthy()




// Helper to convert boolean values into a simple string version
// Note: Cannot be on the Component, the observer doesn't recognize
//       `this.stringifyBoolean` as a function
var stringifyBoolean = function(key) {

  // Remove first underscore from the key name
  var dep = key.substring(1);

  // Get the actual dependency value
  var value = this.get(dep);

  // Do not apply attribute if value not passed in
  // or the value is already a string, probably "true" or "false"
  if (value === undefined) {
    return value;
  }

  // Return the string version of true/false
  return isTruthy(value) ? 'true' : 'false';

}; // stringifyBoolean()




export default Ember.Component.extend({
  tagName: 'input',
  type: 'checkbox',




  // bootstrap-switch element options (data-*)
  // and native HTML element attributes.
  // The "source of truth" are the dasherized and
  // data-'less version of the bootstrap-switch option name.
  attributeBindings: [
    '_animate:data-animate',             // Boolean option, need to "stringify"
    '_indeterminate:data-indeterminate', // Boolean option, need to "stringify"
    '_inverse:data-inverse',             // Boolean option, need to "stringify"
    '_radio-all-off:data-radio-all-off', // Boolean option, need to "stringify"
    'autofocus',
    'base-class:data-base-class',
    // 'checked',                        // Checked state is handled by events
    'disabled',
    'form',
    'formnovalidate',
    'handle-width:data-handle-width',
    'label-text:data-label-text',
    'label-width:data-label-width',
    'name',
    'off-color:data-off-color',
    'off-text:data-off-text',
    'on-color:data-on-color',
    'on-text:data-on-text',
    'readonly',
    'required',
    'size:data-size',
    'tabindex',
    'type',
    'value',
    'wrapper-class:data-wrapper-class'
  ], // :attributeBindings




  // Boolean bound attributes will only cause the attribute name to be applied or not
  // Therefore, we have to "stringify" the boolean so it'll be applied as the attribute value
  _animate:         Ember.computed('animate',       stringifyBoolean),
  _indeterminate:   Ember.computed('indeterminate', stringifyBoolean),
  _inverse:         Ember.computed('inverse',       stringifyBoolean),
  '_radio-all-off': Ember.computed('radio-all-off', stringifyBoolean),




  // By default, if the 'checked' state is unknown,
  // then set the bootstrap-switch in an indeterminate state.
  // Note: Not as useful in a group of radios
  indeterminate: Ember.computed('checked', function(){
    var type    = this.get('type');
    var checked = this.get('checked');
    if (type !== 'radio' && (checked === undefined || checked === null)) {
      return true;
    }
  }), // :indeterminate




  // The bootstrap-switch jQuery plugin does not observe attribute changes,
  // so we need to watch for the bootstrap-switch specific properties
  // and apply them to the bootstrap-switch plugin "manually".
  optionChanged: Ember.observer(
    'animate',
    'base-class',
    'handle-width',
    'indeterminate',
    'inverse',
    'label-text',
    'label-width',
    'off-color',
    'off-text',
    'on-color',
    'on-text',
    'radio-all-off',
    'size',
    'wrapper-class',
    'disabled',
    'readonly',
  function(component, key){
    Ember.run(function(){
      var option = Ember.String.camelize(key);
      component.$().bootstrapSwitch(option, component.get(key));
    });
  }), // :optionChanged




  // Checkbox default checked state will commonly (and by default)
  // come from the _initial_ 'checked' state.
  // Think of this as Ember.computed.readsOnce('checked')
  'checked-default': Ember.computed(function(){
    // Is it likely that a promise will be passed in as the initial 'checked' value?
    // If so, how do we handle the promise? In the setDefaultState() handler?
    return this.get('checked');
  }), // :'checked-default'




  // Since the `checked` attribute will not make it to the DOM element (via Ember),
  // set the default checked state via JavaScript (which may set the element `checked` attribute).
  // This will ensure that a <form> .reset() will work as intended
  setDefaultChecked: Ember.observer('checked-default', function(){
    var checkedDefault = this.get('checked-default');
    this.$().prop('defaultChecked', isTruthy(checkedDefault));
  }), // :setDefaultChecked




  // Setup task to setup event handlers and create the switch
  createSwitch: Ember.on('didInsertElement', function(){
    var component = this;
    var $element  = this.$();

    // Set the <input> default `checked` state
    this.setDefaultChecked();

    // Since .bootstrapSwitch() will make DOM changes
    // it should be run inside an Ember run loop
    Ember.run(function(){

      // Only register an init handler if needed
      // Performant not to register excessive event handlers
      if (component.get('on-init')) {
        $element.on('init.bootstrapSwitch', component, component.switchInit);
      }

      // Init bootstrap-switch
      $element.bootstrapSwitch();

      // Always handle a switch change
      // This is where the status will be updated
      $element.on('switchChange.bootstrapSwitch', component, component.switchChange);

    }); // Ember.run()
  }), // :createSwitch




  // Tear down task to remove event handlers and destroy the switch
  destroySwitch: Ember.on('willDestroyElement', function(){
    var component = this;
    var $element  = this.$();

    // Since .bootstrapSwitch() will make DOM changes
    // it should be run inside an Ember run loop
    Ember.run(function(){

      // Init handler only registered if needed
      if (component.get('on-init')) {
        $element.off('init.bootstrapSwitch', component, component.switchInit);
      }

      // Remove our change handler
      $element.off('switchChange.bootstrapSwitch', component, component.switchChange);

      // Remove bootstrap-switch
      $element.bootstrapSwitch('destroy');

      // Call destroy action if defined
      if (component.get('on-destroy')) {
        component.sendAction('on-destroy', component);
      }

    }); // Ember.run()
  }), // :destroySwitch




  // Event handler triggered if an action was defined
  switchInit: function(event){
    // event.data == reference to this Ember Component
    // this == reference to the DOM Element
    var component = event.data;
    component.sendAction('on-init', component, event);
  }, // :switchInit




  // Event handler triggered whenever the switch changes
  switchChange: function(event, state){
    // event.data == reference to this Ember Component
    // this == reference to the DOM Element
    var component = event.data;

    // Save the switch state to the component
    component.set('checked', state);

    // Call change action if defined
    if (component.get('on-switch-change')) {
      component.sendAction('on-switch-change', component, event, state);
    }

  }, // :switchChange




  // Handler when the upstream 'checked' property binding changes
  // Updates the switch to reflect the new state
  bindingChange: Ember.observer('checked', function(){
    var $element = this.$();
    var checked  = this.get('checked');

    // The switchChange() handler will .set('checked')
    // which will trigger this observer. Ignore the call
    // if the checked state is the same as the switch state
    if (checked === $element.bootstrapSwitch('state')) {
      return;
    }

    // Since .bootstrapSwitch() will make DOM changes
    // it should be run inside an Ember run loop
    Ember.run(function(){

      // Third param, true, skips switchChange()
      $element.bootstrapSwitch('state', checked, true);

    }); // Ember.run()
  }) // :bindingChange


}); // export

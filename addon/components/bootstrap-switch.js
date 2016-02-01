import Ember from 'ember';




// Helper to help determine a values truthlyness,
// mainly needed for string "false"
// (Used to be a jQuery post about this, but below is very similar)
// http://www.sitepoint.com/javascript-truthy-falsy/
export function isTruthy( value ) {

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

} // isTruthy()




// Convert the value to the proper option type.
// This is especially useful for string booleans ("false"),
// and Ember SafeString objects (typically from intl addons)
export function convertValue( value, type ) {
  if ( type === 'boolean' ) {
    return isTruthy( value );
  } else if ( type === 'string' ) {
    Ember.assert('Object must have a .toString() method!', !value.toString);
    return value.toString();
  } else if ( type === 'array' ) {
    return ( Array.isArray( value ) ? value : [ value ] );
  } else {
    return value;
  }
} // convertValue()




export default Ember.Component.extend({
  tagName: 'input',
  type: 'checkbox',




  // Flags used for internal state management
  switchInitializing : false,
  switchInitialized  : false,




  // Native HTML element attributes
  attributeBindings: [
    'autofocus',
    'checked',
    'disabled',
    'form',
    'formnovalidate',
    'name',
    'readonly',
    'required',
    'tabindex',
    'type',
    'value'
  ], // :attributeBindings



  // List of bootstrap-switch options,
  // used to determine which attributes apply to the switch
  // http://www.bootstrap-switch.org/options.html
  switchOptions: {
    state         : 'boolean',
    size          : 'string',
    animate       : 'boolean',
    disabled      : 'boolean',
    readonly      : 'boolean',
    indeterminate : 'boolean',
    inverse       : 'boolean',
    radioAllOff   : 'boolean',
    onColor       : 'string',
    offColor      : 'string',
    onText        : 'string',
    offText       : 'string',
    labelText     : 'string',
    handleWidth   : 'string',
    labelWidth    : 'string',
    baseClass     : 'string',
    wrapperClass  : 'array'
    // onInit and onSwitchChange handled by the component
  }, // :switchOptions




  // Helpful default, set 'indeterminate' state to true
  // if the checked option is not defined. Users should
  // override (define the attribute) if not desired
  indeterminate: Ember.computed('checked', function(){
    const checked = this.get('checked');
    return (checked === null || checked === undefined);
  }), // :indeterminate




  // Need to keep track of the initial attributes for 'didRender()'
  didInitAttrs( attrs ){
    this._super(...arguments);
    this.set('_initialAttrs', attrs.attrs);
  }, // didInitAttrs()




  // Setup task to create the switch using defined options
  // By using the 'didRender' hook, instead of 'didInsertElement',
  // this component should work properly with Fastboot (not tested)
  didRender(){
    this._super(...arguments);

    // Since this hook will run upon subsequent re-renders,
    // we only need to initialize the switch once
    if (this.get('switchInitializing') || this.get('switchInitialized')) {
      return;
    }

    // Set the initializing flag so we don't initialize again
    this.set('switchInitializing', true);

    // Setup variables needed
    const $element     = this.$();
    const initialAttrs = this.get('_initialAttrs') || {};
    const checked      = this.getAttrFor( initialAttrs, 'checked' );

    // Start the options hash...
    // Always add the event handlers,
    // eliminates the need to add event listeners to the DOM
    let options = {
      onInit         : this.switchInit.bind(this),
      onSwitchChange : this.switchChange.bind(this),
      indeterminate  : this.get('indeterminate') // inject the "helpful default"
    };

    for (let attrKey in initialAttrs) {

      // Ensure the camelized format is used,
      // bootstrap-switch option names use this format
      let attrKeyCamelized = Ember.String.camelize( attrKey );

      // bootstrap-switch uses 'state' instead of 'checked'
      if (attrKey === 'checked') {
        attrKeyCamelized = 'state';
      }

      // Ignore non-switch options, such as other native HTML attributes, eg: tabindex
      if (!this.switchOptions.hasOwnProperty( attrKeyCamelized )) {
        continue;
      }

      // Get the value from attrs
      // Note: Private Ember API, watch for changes
      // https://github.com/emberjs/ember.js/blob/v2.1.0/packages/ember-views/lib/compat/attrs-proxy.js#L54
      let attrValue = this.getAttrFor( initialAttrs, attrKey );

      // Convert the value to the proper option type
      options[ attrKeyCamelized ] = convertValue( attrValue, this.switchOptions[ attrKeyCamelized ]);

    } // for ()

    // Enables a <form> reset to work properly
    $element.prop('defaultChecked', isTruthy(checked));

    // Create the switch with defined options
    $element.bootstrapSwitch( options );

  }, // didRender()




  // Task to update the bootstrap-switch as options are changed.
  // This replaces the observers used in an older version of this addon.
  didUpdateAttrs( attrs ){
    this._super(...arguments);
    const {newAttrs, oldAttrs} = attrs; // cool ES2015 syntax to destructure named properties

    // Skip if bootstrap-switch not created yet
    if (!this.get('switchInitialized')) {
      // Save new attributes if switch initialization not started
      if (!this.get('switchInitializing')) {
        this.set('_initialAttrs', newAttrs);
      }
      return;
    }

    // Setup variables needed
    const $element = this.$();

    // Loop through each new attribute...
    for (let attrKey in newAttrs) {

      // Ensure the camelized format is used,
      // bootstrap-switch option names use this format
      let attrKeyCamelized = Ember.String.camelize( attrKey );

      // bootstrap-switch uses 'state' instead of 'checked'
      if (attrKey === 'checked') {
        attrKeyCamelized = 'state';
      }

      // Ignore non-switch options, such as other native HTML attributes, eg: tabindex
      if (!this.switchOptions.hasOwnProperty( attrKeyCamelized )) {
        continue;
      }

      // Get the values to compare
      // Note: Private Ember API, watch for changes
      // https://github.com/emberjs/ember.js/blob/v2.1.0/packages/ember-views/lib/compat/attrs-proxy.js#L54
      let newValue = this.getAttrFor( newAttrs, attrKey );
      let oldValue = this.getAttrFor( oldAttrs, attrKey );

      // Ignore if the option has not changed
      if (newValue === oldValue) {
        continue;
      }

      // Convert the value to the proper option type
      let convertedValue = convertValue( newValue, this.switchOptions[ attrKeyCamelized ]);

      // Special case when updating the checked state
      if (attrKeyCamelized === 'state') {

        // If the old checked state was undefined, but is now defined, then..
        // This helps when the 'checked' attribute is a promise
        if (
          (oldValue === undefined || oldValue === null) &&
          (newValue !== undefined && newValue !== null)
        ) {
          $element.prop('defaultChecked', convertedValue); // Enables a <form> reset to work properly
        }

        // Third param == skip the switchChanged event
        $element.bootstrapSwitch( attrKeyCamelized, convertedValue, true );
      } else {
        $element.bootstrapSwitch( attrKeyCamelized, convertedValue );
      }

    } // for ()

    // Inject the "helpful default" when not defined as an attribute
    if (!newAttrs.hasOwnProperty('indeterminate')) {
      $element.bootstrapSwitch( 'indeterminate', this.get('indeterminate') );
    }

  }, // didUpdateAttrs()




  // Tear down task to update state flags, destroy the switch, and trigger the destroy action
  willDestroyElement(){
    this._super(...arguments);

    // Ignore if not yet initialized
    if (!this.get('switchInitialized')) {
      return;
    }

    // Remove bootstrap-switch
    this.$().bootstrapSwitch('destroy');

    // Change the initialization flag
    this.set('switchInitialized', false);

    // Call destroy action if defined
    if (this.get('on-destroy')) {
      this.sendAction('on-destroy', this);
    }

  }, // willDestroyElement()




  // Event handler triggered after the switch is initialized
  switchInit( event ){

    // Change the initialization flags
    this.set('switchInitializing', false);
    this.set('switchInitialized',  true);

    // Call init action if defined
    if (this.get('on-init')) {
      this.sendAction('on-init', this, event);
    }
  }, // switchInit()




  // Event handler triggered whenever the switch changes
  switchChange( event, state ){

    // Save the switch state to the component,
    // bubbles back up to the attribute when mutable..
    this.set('checked', state);

    // Call radio change action if defined,
    // passes the value as the first argument for easy use with radios
    // Ex: on-switch-active=(action (mut prop))
    if (state && this.get('on-switch-active')) {
      this.sendAction('on-switch-active', this.get('value'), state, this, event);
    }

    // Call switch change action if defined
    if (this.get('on-switch-change')) {
      this.sendAction('on-switch-change', state, this, event);
    }

  }, // switchChange()




  // bootstrap-switch methods are exposed as ember actions
  // http://www.bootstrap-switch.org/methods.html
  actions: {
    toggleState( skip = false ){
      if (this.get('switchInitialized')) {
        this.$().bootstrapSwitch('toggleState', skip);
      }
    }, // toggleState()
    toggleAnimate(){
      if (this.get('switchInitialized')) {
        this.$().bootstrapSwitch('toggleAnimate');
      }
    }, // toggleAnimate()
    toggleDisabled(){
      if (this.get('switchInitialized')) {
        this.$().bootstrapSwitch('toggleDisabled');
      }
    }, // toggleDisabled()
    toggleReadonly(){
      if (this.get('switchInitialized')) {
        this.$().bootstrapSwitch('toggleReadonly');
      }
    }, // toggleReadonly()
    toggleIndeterminate(){
      if (this.get('switchInitialized')) {
        this.$().bootstrapSwitch('toggleIndeterminate');
      }
    }, // toggle Indeterminate()
    toggleInverse(){
      if (this.get('switchInitialized')) {
        this.$().bootstrapSwitch('toggleInverse');
      }
    } // toggleInverse()
  } // :actions


}); // export default

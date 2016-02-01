ember-bootstrap-switch
======================

This [ember-cli](http://www.ember-cli.com/) addon integrates the
[bootstrap-switch](http://www.bootstrap-switch.org/) plugin with your project.
It imports the required bootstrap-switch files into your build but does NOT
import the other, core bootstrap files and theme. Use another addon to get your
project started with bootstrap, such as
[ember-cli-bootswatch](https://www.npmjs.com/package/ember-cli-bootswatch).

Then easily use bootstrap-switch in your templates with the included Ember
Component, documentation below. All of the
[bootstrap-switch options](http://www.bootstrap-switch.org/options.html) are
exposed in the Component, which is easily customizable and robust. Most common,
simple example: `{{bs-switch checked=boundProperty}}`




## Compatibility

This addon works with ember and ember-cli 1.13+ (supports ember 2.x).
For use with older versions of ember, use version 0.2.0 of this addon.




## Installation

From within your [ember-cli](http://www.ember-cli.com/) project, run the
following to install this npm package and the bower dependency for bootstrap-switch:

```bash
# ember-cli 1.13 or higher
ember install ember-bootstrap-switch
```




## Configuration

Most of the configuration options are set directly on the bootstrap-switch
Component. However, there are a couple addon configurations that can be changed.


#### ember-bootstrap-switch addon

Options for this addon are configured in the projects `ember-cli-build.js` file
as an 'ember-bootstrap-switch' object property. Available options include:

* `bootstrapVersion` [2|3]: By default 3, the major bootstrap version used in your project
* `excludeCSS` [boolean]: By default, the `bootstrap-switch.css` file will be imported
* `excludeJS` [boolean]: By default, the `bootstrap-switch.js` file will be imported


#### Usage with ember-cli-less

bootstrap-switch includes [Less](http://lesscss.org/) files which you can use with your
project instead of using the default CSS files. Typically you wouldn't do this unless
you are already using [ember-cli-less](https://www.npmjs.com/package/ember-cli-less)
elsewhere in your project. You'll need to exclude the default CSS files, include the
bower path, and finally import the Less files. Ex:

```javascript
// ember-cli-build.js
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    "ember-bootstrap-switch": {
      excludeCSS: true
    },
    lessOptions: {
      paths: [
        "bower_components/bootstrap/less",
        "bower_components/bootstrap-switch/src/less/bootstrap3"
      ]
    }
  });

  // ... (documentation snipped)

  return app.toTree();
};
```

```less
// app/styles/app.less
@import "bootstrap";
@import "bootstrap-switch";
```


#### bootstrap-switch version

You can adjust the version of bootstrap-switch imported by having `bower` install
a different version. Ex:

```bash
bower install --save bootstrap-switch#1.8.0
```


#### bootstrap-switch defaults

As mentioned in the [bootstrap-switch documentation](http://www.bootstrap-switch.org/options.html),
you can change the global defaults that bootstrap-switch uses. Simply create a
new Ember Initializer, `ember g initializer bootstrap-switch-defaults`, and
define them on [Ember's alias for jQuery](http://emberjs.com/api/#method__).
Be sure to `import` Ember, as the generated initializer code does not do so. Ex:

```javascript
// app/initializers/bootstrap-switch-defaults.js
import Ember from 'ember';

export function initialize(/* container, application */) {
  Ember.$.fn.bootstrapSwitch.defaults.onColor = 'success';
  Ember.$.fn.bootstrapSwitch.defaults.onText  = 'Yes';
  Ember.$.fn.bootstrapSwitch.defaults.offText = 'No';
}

export default {
  name: 'bootstrap-switch-defaults',
  initialize: initialize
};
```




## Component

This addon includes a Component that will properly use the bootstrap-switch plugin.
There are two names that you can use, `{{bootstrap-switch}}` or `{{bs-switch}}`.
Both point to the same Component so it is your preference which to use.


#### Attributes / Options

The Component has many attributes that can be modified, including all of the
[bootstrap-switch options](http://www.bootstrap-switch.org/options.html).
All options may be bound properties and will properly update the switch when
changed. But most of the time you'll only bind the `checked` property and set
the others as attribute strings with your preference,
`{{bs-switch checked=switchState on-text="Yes" off-text="No"}}`.

Native HTML attributes will be applied to the DOM element as typically expected.
However, bootstrap-switch options are passed in the options hash when initializing.
Any subsequent option updates will be applied to bootstrap-switch using its "set" method.


Component Attribute | Bootstrap Switch Option | Native `<input>` Attribute | Notes
-----------------------------|-------------------------|----------------------------|------
animate          | animate        |       | Whether the switch animates between states
autofocus        |                | Yes   | Should probably be handled elsewhere in Ember
base-class       | baseClass      |       |
checked          | state          |       | NOT the native HTML checked attr
disabled         | disabled       | Yes   |
form             |                | Yes   |
formnovalidate   |                | Yes   |
handle-width     | handleWidth    |       | Width of the entire switch
indeterminate    | indeterminate  |       | Places the switch "in the middle", between on/off
inverse          | inverse        |       | Reverses what side the on/off labels are on
label-text       | labelText      |       | Text in between the on/off labels
label-width      | labelWidth     |       | Space between the on/off labels
name             |                | Yes   | Required for radios
off-color        | offColor       |       | Bootstrap contextual color name (primary, success, info, warning, danger)
off-text         | offText        |       |
on-color         | onColor        |       | Bootstrap contextual color name (primary, success, info, warning, danger)
on-destroy       |                |       | Action sent on component destruction
on-init          | onInit         |       | Action sent on switch init
on-switch-active |                |       | Action sent when the state is true (see usage below)
on-switch-change | onSwitchChange |       | Action sent on switch change
on-text          | onText         |       |
radio-all-off    | radioAllOff    |       | When used as radios, can they all be unchecked
readonly         | readonly       | Yes   |
required         |                | Yes   |
size             | size           |       | Bootstrap contextual button size name (lg, sm, xs)
tabindex         |                | Yes   |
type             |                | Yes   | Either 'checkbox' or 'radio'
value            |                | Yes   | Useful when used as radios
wrapper-class    | wrapperClass   |       |


*Note: Boolean strings will be properly interpreted as a boolean. Ex: "false"*

*Warning: Do not use the bootstrap-switch 'state' as a property. Ember internals will throw a warning.*


###### Indeterminate Default

The 'indeterminate' option by default reads the 'checked' property and if
`undefined` or `null` will return `true`, setting the switch to an indeterminate
state (between on/off labels). This is helpful when passing a Promise in as the
'checked' attribute, the switch will be "indeterminate" until the Promise resolves.
To override this functionality, simply define the attribute:
`{{bs-switch indeterminate="false"}}`


#### Action Handlers / Events

The Component also captures [bootstrap-switch events](http://www.bootstrap-switch.org/events.html)
and triggers them as Ember actions. Ex: `{{bs-switch checked="true" on-switch-change="handleChange"}}`
Depending on the event/action, your function signature differs (below). Each action handler has access
to the Component, which you can manipulate as needed, including:

```javascript
function(component) {
  component;                       // Ember Component
  component.element;               // Native DOM Element
  component.$();                   // jQuery Element
  component.$().bootstrapSwitch(); // Direct access to the bootstrap-switch plugin
}
```

*Note: You cannot `component.set('option-name', 'option-value')` since all option changes are handled through the [new attribute hooks](http://emberjs.com/blog/2015/06/12/ember-1-13-0-released.html#toc_component-lifecycle-hooks). Use `component.$().bootstrapSwitch('option-name', 'option-value')` instead if needed.*


###### on-init

Fires when the bootstrap-switch triggers its 'init' event.
This is NOT the Ember Component 'init' nor 'didInsertElement' events,
but will occur very soon after since that's when bootstrap-switch is created.

```javascript
function(component, event){
  // your code
}
```


###### on-switch-change

Fires when the bootstrap-switch triggers its 'switchChange' event.
The Component also reacts to this by changing the 'checked' state.
The 'state' argument will be a boolean, which reflects the new state.

*Note: The signature changed between version 0.2.0 and 1.13.0, state was moved to the first position.*

```javascript
function(state, component, event){
  // your code
}
```


###### on-switch-active

Fires when the bootstrap-switch triggers its 'switchChange' event
and the new state is `true`. The difference between this action and
'on-switch-change' is that the value is passed as the first argument.
This is useful when used as radios, to easily get the "active" value.
See the radio example below.

```javascript
function(value, component, event){
  // your code
}
```


###### on-destroy

Fires on the Ember Components 'willDestroyElement' event.
The bootstrap-switch plugin does not have a destroy event to watch.
However, you can access the plugin as mentioned above before
bootstrap-switch is actually destroyed.

```javascript
function(component){
  // your code
}
```


#### Actions / Methods

All [bootstrap-switch toggle methods](http://www.bootstrap-switch.org/methods.html)
are exposed as actions on the component. You will first need access to the component
instance, which can be captured via the `on-init` event handler (example below),
or any other handlers mentioned above. Available actions:

* toggleState
* toggleAnimate
* toggleDisabled
* toggleReadonly
* toggleIndeterminate
* toggleInverse

```javascript
// app/controllers/foobar.js
import Ember from 'ember';

export default Ember.Controller.extend({
  switch: undefined,
  actions: {
    registerSwitch( component ){
      this.set('switch', component);
    },
    toggleSwitch(){
      this.get('switch').send('toggleState');
    }
  }
});
```

```handlebars
{{!-- app/templates/foobar.js --}}
{{bs-switch on-init="registerSwitch"}}
<button {{action "toggleSwitch"}}>Toggle</button>
```


#### Customizing

Although not required, you can `.extend()` the Component to change the way it
works, such as setting defaults other than bootstrap-switch options. Simply
create a new Component in your app and extend the addon's Component. You can
either override the existing name, `ember g component bs-switch`, or use your
own name, `ember g component my-switch`. Then import the Component from the
addon, and export your extended version. Ex:

```javascript
// app/components/my-switch.js
import BootstrapSwitchComponent from 'ember-bootstrap-switch/components/bootstrap-switch';
export default BootstrapSwitchComponent.extend({
  // your changes here
  // look at the source code for details
});
```




## Examples


#### Usage as angle bracket components

When used as an angle bracket component (once it lands in Ember), one-way data binding
is enabled by default. That means the 'checked' property you pass in will not update
automatically. There are two ways to handle this, re-enable two-way binding by using the
`mut` helper or handle the change yourself using the 'on-switch-change' action.

```javascript
// app/controllers/foobar.js
import Ember from 'ember';

export default Ember.Controller.extend({
  checkedState: true,
  actions: {
    switchChanged(state){
      this.set('checkedState', state);
    }
  }
});
```

```handlebars
{{!-- app/templates/foobar.js --}}
<bs-switch checked={{mut checkedState}} />
<bs-switch checked={{checkedState}} on-switch-change={{action 'switchChanged'}} />
```


#### Usage as radios

There are a [couple](https://github.com/nostalgiaz/bootstrap-switch/issues/418)
[issues](https://github.com/nostalgiaz/bootstrap-switch/issues/423) with using
bootstrap-switch as radios that affects usage in Ember. The 'switchChange' event
currently only fires on the radio/switch that is clicked. Although helpful, the
other radios/switches do not know about the change in state, so 'checked'
bindings will not be updated in Ember.

Currently the best way to use bootstrap-switch as radios is to use values to
determine the active radio. Using a couple Helpers and computed properties,
you can easily

```javascript
// app/controllers/foobar.js
import Ember from 'ember';

export default Ember.Controller.extend({
  radioValue: null,
  fooASelected: Ember.computed.equals('radioValue', 'fooA'),
  fooBSelected: Ember.computed.equals('radioValue', 'fooB'),
  fooCSelected: Ember.computed.equals('radioValue', 'fooC')
});
```

```handlebars
{{!-- app/templates/foobar.js --}}
{{bs-switch name="foo" value="fooA" checked=(readonly fooASelected) on-switch-active=(mut radioValue)}}
{{bs-switch name="foo" value="fooB" checked=(readonly fooBSelected) on-switch-active=(mut radioValue)}}
{{bs-switch name="foo" value="fooC" checked=(readonly fooCSelected) on-switch-active=(mut radioValue)}}
```

Or, using the [ember-truth-helpers](https://www.npmjs.com/package/ember-truth-helpers),
you only need `radioValue` and use the `eq` helper to determine checked state.

```handlebars
{{!-- app/templates/foobar.js --}}
{{bs-switch name="foo" value="fooA" checked=(eq radioValue "fooA") on-switch-active=(mut radioValue)}}
{{bs-switch name="foo" value="fooB" checked=(eq radioValue "fooB") on-switch-active=(mut radioValue)}}
{{bs-switch name="foo" value="fooC" checked=(eq radioValue "fooC") on-switch-active=(mut radioValue)}}
```

#### Usage as radios with 'radioAllOff'

In addition to the radio issues mentioned above, if used with the 'radio-all-off' option,
the above radio examples will not work properly when all radios are "off". To fix this,
you'll need to handle the `radioValue` state manually using the 'on-switch-change' action.

```javascript
// app/controllers/foobar.js
import Ember from 'ember';

export default Ember.Controller.extend({
  radioValue: null,
  actions: {
    switchChanged( state, component ){
      // 'state' will typically always be `true`,
      // unless the 'radio-all-off' option is `true`
      const newValue = (state ? component.get('value') : null);
      this.set('radioValue', newValue);
    }
  }
});
```

```handlebars
{{!-- app/templates/foobar.js --}}
{{bs-switch name="foo" value="fooA" checked=(eq radioValue "fooA") on-switch-change="switchChanged" radio-all-off=true}}
{{bs-switch name="foo" value="fooB" checked=(eq radioValue "fooB") on-switch-change="switchChanged" radio-all-off=true}}
{{bs-switch name="foo" value="fooC" checked=(eq radioValue "fooC") on-switch-change="switchChanged" radio-all-off=true}}
```

This documentation will be updated once the bootstrap-switch radio issues are fixed.

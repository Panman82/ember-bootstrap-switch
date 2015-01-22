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
exposed in the Component, which is easily customizable and robust. Please submit
Issues and Pull Requests on the GitHub repo as needed.




## Installation

From within your [ember-cli](http://www.ember-cli.com/) project, run the
following (depending on your ember-cli version) to install the addon and
bower dependency for bootstrap-switch:

```bash
# ember-cli 0.1.5 or higher
ember install:addon ember-bootstrap-switch
```

```bash
# ember-cli from 0.0.43 to 0.1.4
npm install --save-dev ember-bootstrap-switch
ember generate ember-bootstrap-switch
```

```bash
# ember-cli from 0.0.41 to 0.0.43
npm install --save-dev ember-bootstrap-switch
bower install --save bootstrap-switch
```




## Configuration

Most of the configuration options are set directly on the bootstrap-switch
Component. However, there are a couple addon configurations that can be changed.


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
Be sure to `import` Ember, as the default initializer code does not do so. Ex:

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


#### Attributes / Properties

The Component has many properties that can be modified, including all of the
[bootstrap-switch options](http://www.bootstrap-switch.org/options.html).
All options may be bound properties and will properly update the switch when
changed. But most of the time you'll only bind the 'checked' property and set
the others as attribute strings with your preference,
`{{bs-switch checked=switchState on-text="Yes" off-text="No"}}`.

All properties (except 'checked-default' and action handlers) will then be
applied to the `<input>` element as their respective bootstrap-switch option
and native element attribute names. This way the bootstrap-switch plugin
reads the options from the element as is typically expected.


Component Attribute/Property | Bootstrap Switch Option | Native `<input>` Attribute | Notes
-----------------------------|-------------------------|----------------------------|------
animate          | animate        |       | Whether the switch animates between states
autofocus        |                | Yes   | Should probably be handled elsewhere in Ember
base-class       | baseClass      |       |
checked          | state          |       | NOT the native HTML checked attr
checked-default  |                |       | Defaults to the initial 'checked' state
disabled         | disabled       | Yes   |
form             |                | Yes   |
formnovalidate   |                | Yes   |
handle-width     | handleWidth    |       | Width of the entire switch
indeterminate    | indeterminate  |       | Places the switch "in the middle", between on/off
inverse          | inverse        |       | Reverses what side the on/off labels are on
label-text       | labelText      |       | Text in between the on/off labels
label-width      | labelWidth     |       | Space between the on/off labels
name             |                | Yes   | Required for radios
off-color        | offColor       |       | Bootstrap contextual color name
off-text         | offText        |       |
on-color         | onColor        |       | Bootstrap contextual color name
on-destroy       |                |       | Action name sent on component destruction
on-init          | onInit         |       | Action name sent on switch init
on-switch-change | onSwitchChange |       | Action name sent on switch change
on-text          | onText         |       |
radio-all-off    | radioAllOff    |       | When used as radios, can they all be unchecked
readonly         | readonly       | Yes   |
required         |                | Yes   |
size             | size           |       | Bootstrap contextual button size name
tabindex         |                | Yes   |
type             |                | Yes   | Either 'checkbox' or 'radio'
value            |                | Yes   |
wrapper-class    | wrapperClass   |       |


*Note: Boolean strings will be properly interpreted as a boolean. Ex: "false"*

*Warning: Do not use the bootstrap-switch 'state' as a property. Ember internals will throw a warning.*


#### Action Handlers

The Component also captures bootstrap-switch events and exposes them as Ember actions.
Depending on the event/action, your function signature differs (below). Each action
handler has access to the Component, which you can manipulate as needed, including:

```javascript
function(component) {
  component;                       // Ember Component
  component.element;               // Native DOM Element
  component.$();                   // jQuery Element
  component.$().bootstrapSwitch(); // Direct access to the bootstrap-switch plugin
}
```


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

```javascript
function(component, event, state){
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


###### Special Defaults

`'checked-default'` by default reads the initial 'checked' state but will not
update when 'checked' is changed.

The 'checked-default' state will be applied to the element via JavaScript
as the 'defaultChecked' property, which in turn, applies the 'checked' attribute.
Sounds confusing but it's a UX fix, this will allow a form `.reset()` to work properly.

`'indeterminate'` by default observes the 'checked' property and if
'undefined' or 'null' will be 'true', setting the switch to an indeterminate
state (between on/off labels). Else it will remain 'undefined' and not be
applied to the element. This only applies when the 'type' is not a 'radio'.




#### Customizing

Although not required, you can `.extend()` the Component to change the way it
works, such as setting defaults other than bootstrap-switch options. Simply
create a new Component in your app and extend the addon's Component. You can
either override the existing name, `ember g component bs-switch`, or use your
own name, `ember g component my-switch`. Then import the Component from the
addon, and export your extended version. Ex:

```javascript
import BootstrapSwitchComponent from 'ember-bootstrap-switch/components/bootstrap-switch';
export default BootstrapSwitchComponent.extend({
  // your changes here
  // look at the source code for details
});
```




## Examples


#### Ember 2.0, Data Down, Actions Up

In the Ember 2.0 world, the methodology is data down, actions up. This means you
pass the checked state down into the Component, but if the Component changes the
state it should send an action back up with the new state. And once Ember 2.0 lands,
one-way binding will be the default so actions will be used for the other direction.
To emulate this methodology today, use the following:

```javascript
// app/controllers/foobar.js
import Ember from 'ember';

export default Ember.Controller.extend({
  checkedState: true,
  actions: {
    switchChanged: function(component, event, state){
      this.set('checkedState', state);
    }
  }
});
```

```
{{!-- app/templates/foobar.js --}}
{{!-- checked-default is not bound and will not update on switchChange --}}
{{bs-switch checked-default=checkedState on-switch-change="switchChanged"}}
```


With the full implementation of HTMLbars and Ember 2.0's one-way bindings,
here is what the template would then look like:

```html
<!-- app/templates/foobar.hbs -->
<bs-switch checked={{checkedState}} on-switch-change={{action "switchChanged"}} />
```


Of course you'll always have the option to "re-enable" two-way binding.
This way you don't need to use actions. Again, this is in Ember 2.0.

```html
<!-- app/templates/foobar.hbs -->
<bs-switch checked={{mut checkedState}} />
```


#### Usage as radios

There are a couple issues with using bootstrap-switch as radios that affects
usage in Ember. The 'switchChange' event currently only fires on the radio/switch
that is clicked. Although helpful, the other radios/switches do not know about
the change in state, so 'checked' bindings will not be updated in Ember.

Currently the only way to use bootstrap-switch as radios is to look for the
'on-switch-change' action and get the value of whatever was clicked.

```javascript
// app/controllers/foobar.js
import Ember from 'ember';

export default Ember.Controller.extend({
  radioValue: null,
  actions: {
    switchChanged: function(component, event, state){
      // 'state' will typically always be `true`,
      // unless the 'radio-all-off' option is `true`
      var newValue = (state ? component.get('value') : null);
      this.set('radioValue', newValue);
    }
  }
});
```

```
{{!-- app/templates/foobar.js --}}
{{bs-switch name="baz" value="bazA" checked="true"  on-switch-change="switchChanged"}}
{{bs-switch name="baz" value="bazB" checked="false" on-switch-change="switchChanged"}}
{{bs-switch name="baz" value="bazC" checked="false" on-switch-change="switchChanged"}}
```

This documentation will be updated once the bootstrap-switch radio issues are fixed.

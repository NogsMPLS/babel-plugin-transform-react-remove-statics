# Babel Plugin for removing statics from React components

Remove unnecessary statics attached to React components for different build environments

## Usage

### Via `.babelrc` (Recommended)
Simply pass in the name of the static you want removed during build and set a boolean. If true, the static will be removed, if false, the static will stay attached to the component.

This can be particularly useful if you want to switch certain statics on/off for certain environments. An example of this would be using something like [react-styleguide-generator-alt](https://github.com/theogravity/react-styleguide-generator-alt) for your documentation. Since that tool requires you to attach a static ```styleguide``` to your components, you probably would want to remove it in production. But you would probably want to keep it to actually build your doc server, and then remove PropTypes still. This babel plugin gives you that flexibility.

**.babelrc**

```json
{
  "env": {
    "production": {
      "plugins": ["transform-react-remove-statics", {
        "propTypes": true
    }]
  }
}
```
### Via Node API

```js
require("babel-core").transform("code", {
  plugins: ["transform-react-remove-statics", {
    "propTypes": true
  }]
});
```



## Example Removing PropTypes
Using a configuration like we showed above, we can remove PropTypes from React Components.

**In**
```js
const Foo = React.createClass({
  propTypes: {
    foo: React.PropTypes.string
  }
});
```

**Out**
```js
const Foo = React.createClass({});
```

## Installation

```sh
$ npm install --save-dev babel-plugin-transform-react-remove-statics
```


#License

MIT

## Thanks

This project was originally a fork of [Babel Plugin Transform React Remove PropTypes](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types), by [oliviertassinari](https://github.com/oliviertassinari), which is  in turn a fork of [Babel Plugin React Remove PropTypes](https://github.com/nkt/babel-plugin-react-remove-prop-types)  by [nkt](https://github.com/nkt).

Thank you [nkt](https://github.com/nkt) and [oliviertassinari](https://github.com/oliviertassinari) for letting em stand on your shoulders.
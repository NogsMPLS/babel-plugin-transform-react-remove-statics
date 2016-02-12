import { Component } from "react";

class Foo extends React.Component {
  render() {}
}

Foo.propTypes = {
  foo: React.PropTypes.string
};

class Foo2 extends Component {
  render() {}
}

Foo2.propTypes = {
  foo: React.PropTypes.string
};


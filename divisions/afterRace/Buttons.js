import React, { Component } from "react";
import { render } from "react-dom";

class Buttons extends Component {
  constructor() {
    super();
    this.state = {
      whatButton: ''
    }
  }
  componentDidMount() {
    this.setState({
      whatButton: this.props.whatButton
    });
  }
  render() {
    return (
      <div id="container">
        <input/>
      </div>
    );
  }
}

export default Buttons;
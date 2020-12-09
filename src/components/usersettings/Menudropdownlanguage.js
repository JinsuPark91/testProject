import React, { Component } from 'react';

class Menudropdownlanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: ['한국어', 'English'],
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <select>
        {this.state.lists.map(list => (
          <option key={list} value={list}>
            {list}
          </option>
        ))}
      </select>
    );
  }
}
export default Menudropdownlanguage;

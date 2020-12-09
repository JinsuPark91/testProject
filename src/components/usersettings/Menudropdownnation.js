import React, { Component } from 'react';
import { Select, Option } from 'teespace-core';
import { Form } from 'antd';

class Menudropdownnation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [
        '+386 Slovenia',
        '+677 Solomon Islands',
        '+27 South Africa',
        '+500 South Georgia and the South Sandwich Islands',
        '+82 South Korea',
      ],
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <Form.Item name="nationalcode" valuePropName="checked">
        <Select onChange={this.props.onChange}>
          {this.state.lists.map(list => (
            <Option key={list} value={list}>
              {list}
            </Option>
          ))}
        </Select>{' '}
      </Form.Item>
    );
  }
}

export default Menudropdownnation;

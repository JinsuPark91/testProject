import React from 'react';
import CommonSwitch from '../../components/commons/Switch';

export default {
  title: 'Commons/Switch',
  component: CommonSwitch,
  argTypes: {
    onChange: {
      action: 'onChange',
    },
    checked: {
      type: 'boolean',
    },
    disabled: {
      type: 'boolean',
    },
  },
  args: {},
};

const Template = props => <CommonSwitch {...props} />;

export const Switch = Template.bind({});
Switch.args = {};

import React from 'react';
import CommonCheckbox from '../../components/commons/Checkbox';

export default {
  title: 'Commons/Checkbox',
  component: CommonCheckbox,
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
    shape: {
      control: {
        type: 'select',
        options: ['default', 'round'],
      },
    },
  },
  args: {},
};

const Template = props => <CommonCheckbox {...props} />;

export const Checkbox = Template.bind({});
Checkbox.args = {};

export const CheckboxRound = Template.bind({});
CheckboxRound.args = { shape: 'round' };

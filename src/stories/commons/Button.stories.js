import React from 'react';

import CommonButton from '../../components/commons/Button';

export default {
  title: 'Commons/Button',
  component: CommonButton,
  argTypes: {
    onClick: {
      type: 'function',
      action: 'onClick',
    },
    type: {
      control: {
        type: 'select',
        options: ['solid', 'outlined', 'text', 'system'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'default'],
      },
    },
  },
};

const Template = args => <CommonButton {...args}> Button </CommonButton>;

export const Solid = Template.bind({});
Solid.args = {
  type: 'solid',
  size: 'default',
};

export const Outlined = Template.bind({});
Outlined.args = {
  type: 'outlined',
  size: 'default',
};

export const Text = Template.bind({});
Text.args = {
  type: 'text',
  size: 'default',
};

export const System = Template.bind({});
System.args = {
  type: 'system',
  size: 'default',
};

export const Small = Template.bind({});
Small.args = {
  type: 'solid',
  size: 'small',
};

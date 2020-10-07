import React from 'react';
import CommonRadio from '../../components/commons/Radio';

export default {
  title: 'Commons/Radio',
  component: CommonRadio,
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

const Template = props => <CommonRadio {...props} />;

export const Radio = Template.bind({});
Radio.args = {};

export const RadioDisabled = Template.bind({});
RadioDisabled.args = { checked: true, disabled: true };

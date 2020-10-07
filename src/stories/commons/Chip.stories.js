import React from 'react';

import CommonChip from '../../components/commons/Chip';

export default {
  title: 'Commons/Chip',
  component: CommonChip,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['small', 'default'],
      },
    },
    alert: {
      type: 'boolean',
    },
    disabled: {
      type: 'boolean',
    },
    checked: {
      type: 'boolean',
    },
    onClose: {
      action: 'onClose',
    },
  },
  args: {},
};

const Template = props => <CommonChip {...props} />;

export const Chip = Template.bind({});
Chip.args = { text: 'Test' };

export const ChipAlert = Template.bind({});
ChipAlert.args = { alert: true, text: 'Test' };

export const ChipDisabled = Template.bind({});
ChipDisabled.args = { disabled: true, text: 'Test' };

export const ChipChecked = Template.bind({});
ChipChecked.args = { checked: true, text: 'Test' };

export const ChipIcon = Template.bind({});
ChipIcon.args = {
  icon: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  text: 'Test',
};

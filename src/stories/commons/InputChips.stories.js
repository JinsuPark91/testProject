import React from 'react';
import CommonInputChips from '../../components/commons/InputChips';

export default {
  title: 'Commons/InputChips',
  component: CommonInputChips,
  argTypes: {
    chips: {
      description: 'chip 데이터을 저장하고 있는 배열',
      type: 'array',
      defaultValue: [],
    },
    onAddChip: {
      description: '입력창에서 Space 또는 Enter 입력시 실행할 handler',
      control: null,
      action: 'onAddChip',
    },
    onDeleteChip: {
      description:
        'Chip을 close 하면 실행하는 handler, 선택된 Chip의 string 값이 넘어온다.',
      control: null,
      action: 'onDeleteChip',
    },
  },
  args: {},
};

const Template = props => <CommonInputChips {...props} />;

export const InputChips = Template.bind({});
InputChips.args = {
  chips: [
    { text: 'item1' },
    { text: 'item2' },
    { text: 'item3', checked: true },
  ],
};

export const InputChipsNoInput = Template.bind({});
InputChipsNoInput.args = {
  noInput: true,
  chips: [
    { text: 'item1' },
    { text: 'item2', alert: true },
    { text: 'item3', disabled: true },
    {
      text: 'item4',
      checked: true,
      icon: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    },
  ],
};

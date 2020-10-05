import React from 'react';
import CommonSearch from '../../components/commons/Search';

export default {
  title: 'Commons/Search',
  component: CommonSearch,
  argTypes: {
    shape: {
      defaultValue: 'round',
      control: {
        type: 'select',
        options: ['round', 'square'],
      },
    },
    size: {
      defaultValue: 'default',
      control: {
        type: 'select',
        options: ['default', 'large'],
      },
    },
    onChange: {
      description: 'value 변경시 호출되는 handler',
      action: 'onChange',
    },
    onClear: {
      description: 'x 버튼을 눌렀을 때 호출되는 handler',
      action: 'onClear',
    },
    value: {
      type: 'string',
    },
  },
  args: {},
};

const Template = props => <CommonSearch {...props} />;

export const Search = Template.bind({});
Search.args = {};

export const SearchDisabled = Template.bind({});
SearchDisabled.args = { disabled: true };

export const SearchSquared = Template.bind({});
SearchSquared.args = { shape: 'square' };

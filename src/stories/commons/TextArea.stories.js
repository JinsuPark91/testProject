import React from 'react';
import CommonTextArea from '../../components/commons/TextArea';

export default {
  title: 'Commons/TextArea',
  component: CommonTextArea,
  argTypes: {
    onChange: {
      action: 'onChange',
    },
  },
  args: {},
};

const Template = props => <CommonTextArea {...props} />;

export const TextArea = Template.bind({});
TextArea.args = {};

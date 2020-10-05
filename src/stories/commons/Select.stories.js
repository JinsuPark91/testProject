import React from 'react';
import CommonSelect, { CommonOption } from '../../components/commons/Select';

export default {
  title: 'Commons/Select',
  component: CommonSelect,
  argTypes: {
    onChange: {
      action: 'onChange',
    },
    optionLabelProp: {
      type: 'string',
      required: false,
      description:
        'option 컴포넌트에서 선택시 display 될 내용을 나타내는 property 이름',
    },
  },
  args: {},
};

const Template1 = props => (
  <CommonSelect {...props}>
    <CommonOption value="1">test1</CommonOption>
    <CommonOption value="2">test2</CommonOption>
  </CommonSelect>
);

const Template2 = props => (
  <CommonSelect {...props}>
    <CommonOption value="1" title="t1">
      test1
    </CommonOption>
    <CommonOption value="2" title="t2">
      test2
    </CommonOption>
  </CommonSelect>
);

export const Select = Template1.bind({});
Select.args = {};

export const SelectOptionLabelProp = Template2.bind({});
SelectOptionLabelProp.args = { optionLabelProp: 'title' };

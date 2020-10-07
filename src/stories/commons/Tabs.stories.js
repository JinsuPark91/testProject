import React from 'react';
import CommonTabs, { CommonTabPane } from '../../components/commons/Tabs';

export default {
  title: 'Commons/Tabs',
  component: CommonTabs,
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['1', '2'],
      },
    },
    barColor: {
      control: {
        type: 'color',
      },
    },
    textColor: {
      control: {
        type: 'color',
      },
    },
  },
  args: {},
};

const Template = props => {
  const { type, barColor, textColor } = props;
  return (
    <>
      <CommonTabs type={type} barColor={barColor} textColor={textColor}>
        <CommonTabPane key="1" tab="1">
          Content 1
        </CommonTabPane>
        <CommonTabPane key="2" tab="2">
          Content 2
        </CommonTabPane>
      </CommonTabs>
    </>
  );
};
export const TabsType1 = Template.bind({});
TabsType1.args = { type: '1' };

export const TabsType2 = Template.bind({});
TabsType2.args = { type: '2' };

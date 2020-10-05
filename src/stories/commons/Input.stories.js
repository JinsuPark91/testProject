import React from 'react';
import CommonInput from '../../components/commons/Input';

export default {
  title: 'Commons/Input',
  component: CommonInput,
  argTypes: {
    onChange: {
      action: 'onChange',
    },
    alert: {
      type: 'string',
      required: false,
    },
    placement: {
      control: {
        type: 'select',
        options: [
          'bottom',
          'topLeft',
          'topRight',
          'leftTop',
          'left',
          'leftBottom',
          'rightTop',
          'right',
          'rightBottom',
          'bottomLeft',
          'bottomRight',
        ],
      },
    },
    getPopupContainer: {
      control: false,
      description: 'alert tooltip을 append 할 DOM object를 리턴하는 함수',
    },
    disabled: {
      type: 'boolean',
      defaultValue: false,
    },
    type: {
      type: 'string',
      defaultValue: 'text',
    },
    placeholder: {
      type: 'string',
    },
  },
  args: {},
};

const Template = props => <CommonInput {...props} />;

export const Text = Template.bind({});
Text.args = {
  getPopupContainer: () => document.body,
  placeholder: 'Enter your name',
};

export const TextWithAlert = Template.bind({});
TextWithAlert.args = {
  getPopupContainer: () => document.body,
  alert: 'Enter your name',
};

export const Password = Template.bind({});
Password.args = {
  getPopupContainer: () => document.body,
  type: 'password',
  defaultValue: 'this is password',
};

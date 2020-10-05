import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import CommonToast from '../../components/commons/Toast';
import CommonButton from '../../components/commons/Button';

export default {
  title: 'Commons/Toast',
  component: CommonToast,
  argTypes: {
    visible: {
      type: 'boolean',
      control: false,
    },
    size: {
      control: {
        type: 'select',
        options: ['small', 'medium', 'large'],
      },
    },
    onClose: {
      control: null,
    },
    timeoutMs: {
      type: 'number',
      defaultValue: 1000,
    },
  },
  args: {},
};

const Template = props => {
  const [toastVisible, setToastVisible] = useState(false);
  const { timeoutMs } = props;
  return (
    <>
      <CommonButton onClick={() => setToastVisible(true)} type="solid">
        Open CommonToast
      </CommonButton>
      <CommonToast
        {...props}
        visible={toastVisible}
        onClose={() => {
          setToastVisible(false);
          action('onClose')();
        }}
        timeoutMs={timeoutMs}
      >
        Toast Content
      </CommonToast>
    </>
  );
};
export const Toast = Template.bind({});
Toast.args = { timeoutMs: 1000 };

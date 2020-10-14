import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import CommonMessage from '../../components/commons/Message';
import CommonButton from '../../components/commons/Button';

export default {
  title: 'Commons/Message',
  component: CommonMessage,
  argTypes: {
    visible: {
      type: 'boolean',
      control: false,
    },
  },
  args: {},
};

const Template = props => {
  const [messageVisible, setMessageVisible] = useState(false);
  const { title, subtitle } = props;
  return (
    <>
      <CommonButton onClick={() => setMessageVisible(true)} type="solid">
        Open CommonMessage
      </CommonButton>
      <CommonMessage
        visible={messageVisible}
        title={title}
        subtitle={subtitle}
        btns={[
          {
            type: 'solid',
            text: '저장 후 종료',
            onClick: action('onClick'),
          },
          {
            type: 'solid',
            text: '종료',
            onClick: action('onClick'),
          },
          {
            type: 'outlined',
            text: '취소',
            onClick: () => {
              setMessageVisible(false);
              action('onClick')();
            },
          },
        ]}
      />
    </>
  );
};
export const Message = Template.bind({});
Message.parameters = {
  docs: {
    source: {
      code: `
import CommonButton from './components/common/Button';
import CommonMessage from './components/common/Message';
const Template = props => {
  const [messageVisible, setMessageVisible] = useState(false);
  const { title, subtitle } = props;
  return (
    <>
      <CommonButton onClick={() => setMessageVisible(true)} type="solid">
        Open CommonMessage
      </CommonButton>
      <CommonMessage
        visible={messageVisible}
        title={title}
        subtitle={subtitle}
        btns={[
          {
            type: 'solid',
            text: '저장 후 종료',
            onClick: action('onClick'),
          },
          {
            type: 'solid',
            text: '종료',
            onClick: action('onClick'),
          },
          {
            type: 'outlined',
            text: '취소',
            onClick: () => {
              setMessageVisible(false);
              action('onClick')();
            },
          },
        ]}
      />
    </>
  );
};`,
    },
  },
};
Message.args = { title: '타이틀', subtitle: '서브 타이틀' };

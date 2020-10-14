import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import CommonDialog, { ContentWrapper } from '../../components/commons/Dialog';
import CommonButton from '../../components/commons/Button';
import '../../components/commons/commons.scss';
import 'antd/dist/antd.css';

export default {
  title: 'Commons/Dialog',
  component: CommonDialog,
  argTypes: {
    footer: {
      defaultValue: null,
      description:
        '버튼에 해당하는 React Component 배열을 넘겨주면 된다. footer={null} 을 하면 표시하지 않음.',
      control: null,
    },
    onOk: {
      description: 'default footer 에서 "예"를 눌렀을 때 호출되는 handler',
      type: 'function',
      action: 'onOk',
    },
    onCancel: {
      type: 'function',
      action: 'onCancel',
      description:
        '다이얼로그 x 버튼 눌렀을 때 또는 default footer의 "아니오"를 눌렀을 때 호출되는 핸들러, visible을 false로 set 해주는 핸들러를 넘겨주면 됨',
    },
    visible: {
      type: { name: 'boolean', required: false },
      control: null,
      description: '다이얼로그를 보여주는 flag 변수',
      defaultValue: true,
    },
  },
  args: {},
};

const Template = props => {
  const [visible, setVisible] = useState(false);
  const { title } = props;
  return (
    <>
      <CommonButton type="solid" onClick={() => setVisible(true)}>
        Open Dialog
      </CommonButton>
      <CommonDialog
        {...props}
        visible={visible}
        title={title}
        onCancel={() => {
          setVisible(false);
          action('onCancel')();
        }}
      >
        <ContentWrapper>Dialog Content</ContentWrapper>
      </CommonDialog>
    </>
  );
};

export const Dialog = Template.bind({});
Dialog.args = { title: 'Dialog' };

const footer = [
  <CommonButton onClick={action('onClick')} type="solid">
    Btn1
  </CommonButton>,
  <CommonButton onClick={action('onClick')} type="solid">
    Btn2
  </CommonButton>,
  <CommonButton onClick={action('onClick')} type="solid">
    Btn3
  </CommonButton>,
];
export const DialogCustomFooter = Template.bind({});
DialogCustomFooter.args = { title: 'Dialog', footer };
DialogCustomFooter.parameters = {
  docs: {
    source: {
      code: `
import CommonButton from './components/commons/Button';
import CommonDialog, { ContentWraper } from './components/commons/Dialog';
const Template = props => {
  const [visible, setVisible] = useState(false);
  const { title } = props;
  return (
    <>
      <CommonButton type="solid" onClick={() => setVisible(true)}>
        Open Dialog
      </CommonButton>
      <CommonDialog
        visible={visible}
        title={title}
        onCancel={() => setVisible(false)}
        footer={[
          <CommonButton onClick={() => {/* no-op */}} type="solid">
            Btn1
          </CommonButton>,
          <CommonButton onClick={() => {/* no-op */}} type="solid">
            Btn2
          </CommonButton>,
          <CommonButton onClick={() => {/* no-op */}} type="solid">
            Btn3
          </CommonButton>,
        ]}
      >
        <ContentWrapper>Dialog Content</ContentWrapper>
      </CommonDialog>
    </>
  );
};`,
    },
  },
};

export const DialogNoFooter = Template.bind({});
DialogNoFooter.args = { title: 'Dialog', footer: null };
DialogNoFooter.parameters = {
  docs: {
    source: {
      code: `
import CommonButton from './components/commons/Button';
import CommonDialog, { ContentWraper } from './components/commons/Dialog';
const Template = props => {
  const [visible, setVisible] = useState(false);
  const { title } = props;
  return (
    <>
      <CommonButton type="solid" onClick={() => setVisible(true)}>
        Open Dialog
      </CommonButton>
      <CommonDialog
        visible={visible}
        title={title}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <ContentWrapper>Dialog Content</ContentWrapper>
      </CommonDialog>
    </>
  );
};`,
    },
  },
};

import React, { useState } from 'react';
import { Typography } from 'antd';
import CommonDialog from '../components/commons/Dialog';
import CommonMessage from '../components/commons/Message';
import CommonButton from '../components/commons/Button';
import CommonToast from '../components/commons/Toast';
import CommonInput from '../components/commons/Input';
import CommonInputChips from '../components/commons/InputChips';
import CommonChip from '../components/commons/Chip';
import CommonSearch from '../components/commons/Search';

const { Title } = Typography;

function CommonIntroPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [inputChips, setInputChips] = useState([]);
  const onAddChip = text => {
    /* immutable unique insert */
    const chips = new Set(inputChips);
    chips.add(text);
    setInputChips(Array.from(chips));
  };
  const onDeleteChip = text => {
    console.log(text)
    const chips = new Set(inputChips);
    chips.delete(text);
    setInputChips(Array.from(chips));
  };

  return (
    <>
      <Title>Dialog</Title>
      <CommonButton onClick={() => setModalVisible(true)}>
        Open CommonDialog
      </CommonButton>
      <CommonDialog
        visible={modalVisible}
        closable
        title="공통 다이얼로그 (medium)"
        onCancel={() => setModalVisible(false)}
        size="medium"
      >
        <div>Hello Dialog</div>
      </CommonDialog>
      <CommonButton onClick={() => setMessageVisible(true)}>
        Open CommonMessage
      </CommonButton>
      <CommonMessage
        visible={messageVisible}
        closable
        title="공통 메세지\n(최대 200MB)"
        subtitle="asdasd"
        btns={[
          {
            type: 'solid',
            text: '저장 후 종료',
            handler: () => alert('저장 후 종료'),
          },
          {
            type: 'solid',
            text: '종료',
            handler: () => alert('종료'),
          },
          {
            type: 'outlined',
            text: '취소',
            handler: () => setMessageVisible(false),
          },
        ]}
      />
      <CommonButton onClick={() => setToastVisible(true)}>
        Open CommonMessage
      </CommonButton>
      <CommonToast
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      >
        Toast Popup Text
      </CommonToast>

      <Title>Button</Title>
      <CommonButton type="solid">Text</CommonButton>
      <CommonButton type="solid" disabled>
        Text
      </CommonButton>
      <CommonButton type="outlined">Text</CommonButton>
      <CommonButton type="text">Text</CommonButton>
      <CommonButton type="text" disabled>
        Text
      </CommonButton>
      <CommonButton type="system">Text</CommonButton>
      <CommonButton type="system" disabled>
        Text
      </CommonButton>
      <CommonButton type="solid" size="small">
        small
      </CommonButton>
      <CommonButton type="outlined" size="small">
        small
      </CommonButton>
      <CommonButton type="text" size="small">
        small
      </CommonButton>
      <CommonButton type="system" size="small">
        small
      </CommonButton>

      <Title>Input</Title>
      <CommonInput placeholder="Hinted Text" style={{ width: 120 }} />
      <CommonInput value="Normal Text" style={{ width: 120 }} />
      <CommonInput value="Disabled Text" disabled style={{ width: 120 }} />
      <CommonInput
        value="Disabled Text"
        style={{ width: 120 }}
        alert="asdasdasdasdas"
      />
      <Title>Chips</Title>
      <div>
        <CommonChip text="Text" />
        <CommonChip text="Text" alert />
        <CommonChip text="Text" disabled />
        <CommonChip size="small" text="Small and long text" />
        <CommonChip size="small" text="Small and long text" checked />
      </div>
      <Title>InputChips</Title>
      <CommonInputChips
        onAddChip={onAddChip}
        onDeleteChip={onDeleteChip}
        chips={inputChips}
        size={300}
        placeholder="Enter text"
      />
      <Title>Search</Title>
      <CommonSearch style={{ width: 200 }} />
      <CommonSearch style={{ width: 200 }} disabled value="disabled" />
      <CommonSearch style={{ width: 200 }} shape="square" />
      <CommonSearch style={{ width: 200 }} shape="square" size="large" />
      <CommonSearch
        style={{ width: 200 }}
        size="large"
        placeholder="placeholder"
      />
    </>
  );
}

export default CommonIntroPage;

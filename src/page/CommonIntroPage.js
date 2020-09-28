import React, { useState } from 'react';
import { Form, Typography } from 'antd';
import CommonDialog from '../components/commons/Dialog';
import CommonMessage from '../components/commons/Message';
import CommonButton from '../components/commons/Button';
import CommonToast from '../components/commons/Toast';
import CommonInput from '../components/commons/Input';
import CommonTextArea from '../components/commons/TextArea';
import CommonInputChips from '../components/commons/InputChips';
import CommonChip from '../components/commons/Chip';
import CommonSearch from '../components/commons/Search';
import CommonSelect, { CommonOption } from '../components/commons/Select';
import CommonAttachment from '../components/commons/Attachment';
import CommonTabs, { CommonTabPane } from '../components/commons/Tabs';
import CommonCheckbox from '../components/commons/Checkbox';
import CommonRadio from '../components/commons/Radio';
import CommonSwitch from '../components/commons/Switch';
import CommonDropdown, { CommonMenu } from '../components/commons/Dropdown';

const { Title } = Typography;

const menu = (
  <CommonMenu>
    <CommonMenu.Item>TeeDrive에 첨부</CommonMenu.Item>
    <CommonMenu.Item>내 로컬에 첨부</CommonMenu.Item>
    <CommonMenu.Item>TeeDrive에 저장 후 첨부</CommonMenu.Item>
  </CommonMenu>
);

function CommonIntroPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [inputChips, setInputChips] = useState(['test1', 'test2']);
  const [dropdownQuery, setDropdownQuery] = useState('');
  const onAddChip = text => {
    /* immutable unique insert */
    const chips = new Set(inputChips);
    chips.add(text);
    setInputChips(Array.from(chips));
  };
  const onDeleteChip = text => {
    console.log(text);
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
      <CommonInput
        placeholder="Password"
        type="password"
        style={{ width: 120 }}
      />
      <CommonInput value="Normal Text" style={{ width: 120 }} />
      <CommonInput alert="Error message" placement="top" />
      <CommonInput value="Disabled Text" disabled style={{ width: 120 }} />
      <CommonTextArea rows={2} value="Input Box Text" style={{ width: 200 }} />
      <Title>Chips</Title>
      <div>
        <CommonChip text="Text" />
        <CommonChip text="Text" alert />
        <CommonChip text="Text" disabled />
        <CommonChip size="small" text="Small and long text" />
        <CommonChip size="small" text="Small and long text" checked />
      </div>
      <Title>InputChips</Title>
      <div>
        <CommonInputChips
          onAddChip={onAddChip}
          onDeleteChip={onDeleteChip}
          chips={inputChips}
          size={300}
          placeholder="Enter text"
        />
      </div>
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
      <Title>Select</Title>
      <CommonSelect>
        <CommonOption value="1">text</CommonOption>
        <CommonOption value="2">text</CommonOption>
        <CommonOption value="3">text</CommonOption>
        <CommonOption value="4">text</CommonOption>
        <CommonOption value="5">text</CommonOption>
        <CommonOption value="6">text</CommonOption>
        <CommonOption value="7">text</CommonOption>
      </CommonSelect>
      <CommonSelect optionLabelProp="title">
        <CommonOption value="+82" title="+82">
          +82 (82) Korea, Republic of
        </CommonOption>
        <CommonOption value="+70" title="+70">
          +70 (70) Korea, Republic of
        </CommonOption>
      </CommonSelect>
      <Title>Attachment</Title>
      <CommonAttachment title="Guideline_reference.doc" />
      <CommonAttachment title="Guideline_reference.doc" closable />
      <CommonAttachment title="Guideline_reference.doc" closable deleted />
      <CommonAttachment title="Guideline_reference_teemail.pptx" closable />
      <CommonAttachment
        title="Guideline_reference_teemail.pptx"
        closable
        deleted
      />
      <CommonAttachment title="Guideline_reference.xls" closable />
      <CommonAttachment title="Guideline_reference.xls" closable deleted />
      <CommonAttachment title="Guideline_reference.txt" closable />
      <CommonAttachment title="Guideline_reference.txt" closable deleted />
      <CommonAttachment title="Guideline_reference.png" closable />
      <CommonAttachment title="Guideline_reference.png" closable deleted />
      <CommonAttachment title="Guideline_reference.zip" closable />
      <CommonAttachment title="Guideline_reference.zip" closable deleted />
      <CommonAttachment title="Guideline_reference.dps" closable />
      <CommonAttachment title="Guideline_reference.dps" closable deleted />
      <CommonAttachment title="Guideline_reference.mp3" closable />
      <CommonAttachment title="Guideline_reference.mp3" closable deleted />
      <CommonAttachment title="Guideline_reference.pdf" closable />
      <CommonAttachment title="Guideline_reference.pdf" closable deleted />
      <CommonAttachment title="Guideline_reference.mkv" closable />
      <CommonAttachment title="Guideline_reference.mkv" closable deleted />
      <CommonAttachment
        title="Guideline_reference.mkv"
        closable
        bigsize
        progress={80}
        downloading
      />
      <CommonAttachment
        title="Guideline_reference.mkv"
        closable
        progress={80}
        downloading
      />
      <Title>Tab</Title>
      <CommonTabs style={{ width: 320 }}>
        <CommonTabPane tab="Selected" key="1">
          Selected
        </CommonTabPane>
        <CommonTabPane tab="Normal" key="2">
          Normal
        </CommonTabPane>
      </CommonTabs>
      <CommonTabs barColor="#4B9C23" textColor="#4B9C23" style={{ width: 376 }}>
        <CommonTabPane tab="전체" key="1">
          전체
        </CommonTabPane>
        <CommonTabPane tab="Tab00" key="2">
          Tab00
        </CommonTabPane>
        <CommonTabPane tab="Tab01" key="3">
          Tab01
        </CommonTabPane>
        <CommonTabPane tab="Tab02" key="4">
          Tab02
        </CommonTabPane>
        <CommonTabPane tab="Tab03" key="5">
          Tab03
        </CommonTabPane>
      </CommonTabs>
      <CommonTabs type="2">
        <CommonTabPane tab="스팸 설정" key="1">
          스팸 설정
        </CommonTabPane>
        <CommonTabPane tab="키워드 차단" key="2">
          키워드 차단
        </CommonTabPane>
        <CommonTabPane tab="수신 허용/차단" key="3">
          수신 허용/차단
        </CommonTabPane>
      </CommonTabs>
      <Title>Checkbox</Title>
      <CommonCheckbox />
      <CommonCheckbox checked />
      <CommonCheckbox disabled />
      <CommonCheckbox disabled checked />
      <CommonCheckbox shape="round" />
      <CommonCheckbox shape="round" checked />
      <CommonCheckbox shape="round" disabled />
      <CommonCheckbox shape="round" disabled checked />
      <Title>Radio</Title>
      <CommonRadio />
      <CommonRadio checked />
      <CommonRadio disabled />
      <CommonRadio checked disabled />
      <Title>Switch</Title>
      <CommonSwitch />
      <CommonSwitch checked />
      <CommonSwitch disabled />
      <CommonSwitch disabled checked />
      <Title>Dropdown</Title>
      <CommonDropdown overlay={menu}>
        <CommonButton type="solid">Click me</CommonButton>
      </CommonDropdown>

      <CommonDropdown
        searchable
        data={['test1', 'test2'].filter(
          item => dropdownQuery === '' || item.includes(dropdownQuery),
        )}
        onSearch={query => setDropdownQuery(query)}
      >
        <CommonButton type="solid">Click me</CommonButton>
      </CommonDropdown>
      <CommonDropdown
        overlay={
          <CommonInputChips
            onAddChip={onAddChip}
            onDeleteChip={onDeleteChip}
            chips={inputChips}
            size={300}
            placeholder="Enter text"
          />
        }
      >
        <CommonButton type="solid">Click me</CommonButton>
      </CommonDropdown>
    </>
  );
}

export default CommonIntroPage;

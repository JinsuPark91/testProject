import React from 'react';
import { action } from '@storybook/addon-actions';
import CommonDropdown, { CommonMenu } from '../../components/commons/Dropdown';
import CommonButton from '../../components/commons/Button';
import CommonInputChips from '../../components/commons/InputChips';

export default {
  title: 'Commons/Dropdown',
  component: CommonDropdown,
  argTypes: {
    data: {
      type: 'array',
      required: false,
      defaultValue: [],
      control: null,
      description: 'data 배열로 내용을 그릴 수 있다.',
    },
    overlay: {
      required: false,
      defaultValue: null,
      control: null,
      description: 'overlay에 ReactComponent를 직접 넘기는 것도 가능.',
    },
    searchable: {
      type: 'boolean',
      description:
        '검색을 할 수 있다. overlay를 넘겼을 때에는 지원하지 않는다. onSearch를 이용하여 직접 구현해야 한다.',
    },
  },
  args: {},
};

const menu = (
  <CommonMenu>
    <CommonMenu.Item>TeeDrive에 첨부</CommonMenu.Item>
    <CommonMenu.Item>내 로컬에 첨부</CommonMenu.Item>
    <CommonMenu.Item>TeeDrive에 저장 후 첨부</CommonMenu.Item>
  </CommonMenu>
);

const Template1 = props => (
  <CommonDropdown {...props} overlay={menu}>
    <CommonButton type="solid">Click me</CommonButton>
  </CommonDropdown>
);

const Template2 = props => {
  return (
    <CommonDropdown {...props}>
      <CommonButton type="solid">Click me</CommonButton>
    </CommonDropdown>
  );
};

const Template3 = props => {
  const { chips } = props;
  return (
    <CommonDropdown
      overlay={
        <CommonInputChips
          noInput
          onDeleteChip={action('onDeleteChip')}
          chips={chips}
          size={300}
          placeholder="Enter text"
        />
      }
    >
      <CommonButton type="solid">Click me</CommonButton>
    </CommonDropdown>
  );
};

const dropdownData1 = [
  { text: 'TeeDrive에 첨부', onClick: () => {} },
  { text: '내 로컬에 첨부', onClick: () => {} },
  { text: 'TeeDrive에 저장 후 첨부', onClick: () => {} },
];
const dropdownData2 = [
  { text: 'item1', onClick: () => {} },
  { text: 'item2', onClick: () => {} },
];
export const DropdownWithOverlay = Template1.bind({});
DropdownWithOverlay.args = { data: null };

export const DropdownWithData = Template2.bind({});
DropdownWithData.args = { data: dropdownData1, overlay: null };

export const DropdownSearchableWithData = Template2.bind({});
DropdownSearchableWithData.args = {
  searchable: true,
  data: dropdownData2,
  onSearch: action('onSearch'),
};

export const DropdownWithInputChipsNoInputOption = Template3.bind({});
DropdownWithInputChipsNoInputOption.args = {
  chips: [{ text: 'item1' }, { text: 'item2' }],
};

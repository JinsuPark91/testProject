import React, { useState } from 'react';
import { Search } from 'teespace-core';
import styled from 'styled-components';
import { Modal } from 'antd';
import MemberListView from '../common/MemberListView';

function SpaceMemberListModal({
  visible,
  title,
  onClose = () => {},
  members = [],
}) {
  const [searchText, setSearchText] = useState('');

  const handleClose = () => {
    setSearchText('');
    onClose();
  };

  const handleSearch = event => {
    const targetText = event.target.value;
    setSearchText(targetText);
  };

  const handleChangeSearchText = e => {
    setSearchText(e.target.value);
  };

  const handleClearSearchText = () => {
    setSearchText('');
  };

  const filteredMembers = searchText
    ? members.filter(elem => elem.name.includes(searchText))
    : members;

  return (
    <StyledModal
      visible={visible}
      mask
      footer={null}
      width="24.38rem"
      title={title}
      onCancel={handleClose}
    >
      <StyledSearchForm>
        <StyledSearchBox>
          <StyledSearch
            placeholder="구성원 전체 검색"
            style={{ width: '100%' }}
            onPressEnter={handleSearch}
            onClear={handleClearSearchText}
            onChange={handleChangeSearchText}
            value={searchText}
          />
        </StyledSearchBox>
        <StyledMemberList>
          <MemberListView members={filteredMembers} />
        </StyledMemberList>
      </StyledSearchForm>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-header {
    padding: 0.69rem 0 0.88rem;
  }
  .ant-modal-title {
    font-size: 0.94rem;
    line-height: 1.38rem;
    color: #000000;
    letter-spacing: 0;
  }
`;

const StyledSearchForm = styled.div`
  width: 100%;
  padding: 0.63rem 0.75rem;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  overflow-y: auto;
`;

const StyledSearchBox = styled.div`
  width: 100%;
  .anticon {
    color: #bdc6d3;
  }
  .anticon-search {
    margin-left: 0.63rem;
  }
  &:hover,
  &:focus {
    .anticon {
      color: #000;
    }
  }
  .ant-input {
    padding: 0.38rem 1.88rem;
    &::placeholder {
      color: #929aa4;
    }
  }
`;

const StyledSearch = styled(Search)`
  &.openhomeinput {
    height: 1.81rem;
    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: #fff;
      border: 1px solid #6c56e5;
    }
  }
`;

const StyledMemberList = styled.ul`
  width: 100%;
  padding: 0.63rem 0.81rem 0.63rem 0.63rem;
`;

export default SpaceMemberListModal;

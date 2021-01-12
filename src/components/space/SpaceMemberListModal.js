import React, { useState } from 'react';
import { Search } from 'teespace-core';
import styled from 'styled-components';
import { Modal, Avatar } from 'antd';
import MemberListView from '../common/MemberListView';
import SpaceMemberHeader from './SpaceMemberHeader';

function SpaceMemberListModal({
  visible,
  title,
  onClose = () => {},
  spaceName = '',
  members = [],
}) {
  const [searchText, setSearchText] = useState('');
  const [valueText, setValueText] = useState('');

  const handleClose = () => {
    setSearchText('');
    setValueText('');
    onClose();
  };

  const handleSearch = event => {
    const targetText = event.target.value;
    setSearchText(targetText);
  };

  const handleChangeSearchText = e => {
    // Enter Press시 검색이 현재 기획
    // setSearchText(e.target.value);
    const targetText = e.target.value;
    setValueText(targetText);
    if (!targetText.length) {
      setSearchText('');
    }
  };

  const handleClearSearchText = () => {
    setSearchText('');
    setValueText('');
  };

  const filteredMembers = (searchText
    ? members.filter(elem => elem.displayName?.includes(searchText))
    : members
  ).sort((item1, item2) => {
    // NOTE. '나'를 가장 먼저 표시
    let result = (item2.isMe ? 1 : 0) - (item1.isMe ? 1 : 0);
    if (result === 0) {
      // NOTE. JS 문자열 비교 주의! localeCompare 를 사용하면 한글이 영문보다 먼저 나옴
      if (item1.displayName < item2.displayName) result = -1;
      else if (item1.displayName > item2.displayName) result = 1;
      else result = 0;
    }
    return result;
  });

  const titleNode = title || (
    <>
      <StyledLogo
        shape="square"
        style={{ color: '#fff', backgroundColor: '#75757F' }}
      >
        {spaceName[0]}
      </StyledLogo>
      <StyledTitle>{spaceName}</StyledTitle>
    </>
  );

  return (
    <StyledModal
      visible={visible}
      mask
      footer={null}
      width="24.38rem"
      title={titleNode}
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
            value={valueText}
          />
        </StyledSearchBox>
        <StyledMemberList>
          <SpaceMemberHeader
            spaceName={spaceName}
            userCount={filteredMembers.length}
          />
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

const StyledLogo = styled(Avatar)`
  flex-shrink: 0;
  width: 1.68rem;
  height: 1.68rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
`;

const StyledTitle = styled.strong`
  overflow: hidden;
  display: block;
  font-size: 0.875rem;
  line-height: 1.68rem;
  font-weight: 500;
  color: #000;
  text-overflow: ellipsis;
  padding-left: 0.375rem;
`;

export default SpaceMemberListModal;

import React, { useRef, useState, useCallback } from 'react';
import { useCoreStores, Search, Toast } from 'teespace-core';
import styled from 'styled-components';
import { Button, Modal, Avatar } from 'antd';
import Photos from '../Photos';
import AddFriendsByInvitationDialog from './AddFriendsByInvitationDialog';
import FriendModalImg from '../../assets/none_friends.svg';
// import OrganizationDropdown from '../components/friends/OrganizationDropdown';
import AddFriendsByOrganization from './AddFriendsByOrganization';
import AddFriendsFromSpace from './AddFriendsFromSpace';

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-header {
    padding: 0.69rem 0 0.58rem;
  }
  .ant-modal-title {
    font-size: 0.94rem;
    line-height: 1.38rem;
    color: #000000;
    letter-spacing: 0;
  }
`;

const AddFriendSearchForm = styled.div`
  width: 100%;
  overflow-y: auto;
`;

const SearchBox = styled.div`
  padding: 0.63rem 0.75rem;
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

const GroupBox = styled.div`
    width: 100%;
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.63rem;
    padding 0.38rem 1.25rem;
    border: 1px solid #E3E7EB;
    border-width: 1px 0 1px 0;
    .ant-checkbox-wrapper {
      .ant-checkbox {
        & + span {
          font-size: 0.75rem;
          color: #6C56E5;
          letter-spacing: 0;
        }
      }
    }
`;

const StyleCheckLabel = styled.label`
  cursor: pointer;
`;

const StyleCheckBox = styled.span`
  position: relative;
  margin-left: 0.5rem;
`;

const StyleInput = styled.input`
  position: absolute;
  top: 1px;
  left: 1px;
  z-index: -100;
  width: 0.94rem;
  height: 0.94rem;
  &:checked + span {
    background-color: #6c56e5;
    border: 0;
    &:before {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -0.25rem;
      margin-top: -0.05rem;
      content: '';
      display: block;
      width: 0.3rem;
      height: 0.5rem;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      -webkit-transform: rotate(45deg) scale(1) translate(-50%, -50%);
      transform: rotate(45deg) scale(1) translate(-50%, -50%);
      opacity: 1;
      -webkit-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
      transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    }
  }
`;

const StyleIcon = styled.span`
  position: relative;
  display: inline-block;
  vertical-align: -0.25rem;
  width: 0.94rem;
  height: 0.94rem;
  border-radius: 50%;
  border: 1px solid #c6ced6;
  z-index: 100;
`;

const StyleNum = styled.span`
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #6c56e5;
  letter-spacing: 0;
`;

const InvitationForm = styled.div`
  width: 100%;
  padding: 2.5rem 0 3.69rem;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
`;

const OrganizationTitle = styled.p`
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #3b3b3b;
  letter-spacing: 0;
`;

const StyledInfoText = styled.p`
  margin-bottom: 0.63rem;
  font-size: 0.94rem;
  word-break: break-all;
  color: #000;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.38rem;
`;

const StyledSubInfoText = styled.p`
  margin-bottom: 1.19rem;
  font-size: 0.75rem;
  word-break: break-all;
  color: #696969;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.13rem;
`;

const StyledInfoImg = styled.img`
  width: 12.5rem;
  margin-bottom: 1.38rem;
`;

const StyledButton = styled(Button)`
    width: 9.04rem;
    height: 1.88rem;
    font-size: 0.75rem;
    background-color:
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
`;

const FriendList = styled.ul`
  width: 100%;
  padding: 0.63rem 0.81rem 0.63rem 0.63rem;
`;

const Logo = styled(Avatar)`
  flex-shrink: 0;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 0.5rem;
  margin-right: 0.38rem;
`;

function AddFriendsBySearch({
  visible,
  onCancelAddFriends,
  isOrgExist,
  title,
  isViewMode,
  spaceInfo,
  spaceMemberList,
}) {
  const [isInviteDialogVisible, setIsInviteDialogVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [valueText, setValueText] = useState('');
  const timestamp = useRef(Date.now());
  const isSpaceEmpty = spaceMemberList?.length === 1; // spaceInfo && spaceInfo.userCount === 1;

  const toggleInviteDialog = useCallback(() => {
    setIsInviteDialogVisible(!isInviteDialogVisible);
  }, [isInviteDialogVisible]);

  const handleInviteMember = async () => {
    onCancelAddFriends();
    toggleInviteDialog();
  };

  // UI 기획상 onChange에 검색이 아니라 Enter 키 Press시 검색입니다.
  const handleChangeSearchText = e => {
    const targetText = e.target.value;
    setValueText(targetText);
    if (!targetText.length) {
      setSearchText('');
    }
  };

  const handleCancelInvite = () => {
    setSearchText('');
    setValueText('');
    onCancelAddFriends();
  };

  const handleSearch = event => {
    const targetText = event.target.value;
    setSearchText(targetText);
  };

  const handleCancelIconClick = () => {
    setSearchText('');
    setValueText('');
  };

  return (
    <>
      <StyledModal
        visible={visible}
        mask
        footer={null}
        width="24.38rem"
        title={
          <>
            {isViewMode && (
              <Logo
                shape="square"
                style={{ color: '#fff', backgroundColor: '#75757F' }}
              >
                {title ? title[0] : null}
              </Logo>
            )}
            {title}
          </>
        }
        onCancel={handleCancelInvite}
      >
        {isSpaceEmpty ? (
          <InvitationForm>
            <StyledInfoImg src={FriendModalImg} alt="" />
            <StyledInfoText>프렌즈가 없습니다.</StyledInfoText>
            <StyledSubInfoText>초대할 구성원을 찾아보세요</StyledSubInfoText>
            <StyledButton
              type="solid"
              shape="round"
              onClick={handleInviteMember}
            >
              구성원 초대
            </StyledButton>
          </InvitationForm>
        ) : (
          <AddFriendSearchForm>
            <SearchBox>
              <StyledSearch
                placeholder="구성원 전체 검색"
                style={{ width: '100%' }}
                onPressEnter={handleSearch}
                onClear={handleCancelIconClick}
                onChange={handleChangeSearchText}
                value={valueText}
              />
            </SearchBox>
            {isOrgExist ? (
              <AddFriendsByOrganization
                timestamp={timestamp.current}
                searchText={searchText}
                isViewMode={isViewMode}
              />
            ) : (
              <AddFriendsFromSpace
                spaceName={spaceInfo?.name}
                spaceMembers={spaceMemberList}
                searchText={searchText}
                isViewMode={isViewMode}
              />
            )}
          </AddFriendSearchForm>
        )}
      </StyledModal>
      <AddFriendsByInvitationDialog
        visible={isInviteDialogVisible}
        onSendInviteMail={toggleInviteDialog}
        onCancel={toggleInviteDialog}
      />
    </>
  );
}

export default AddFriendsBySearch;

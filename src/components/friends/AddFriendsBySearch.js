import React, { useRef, useState, useCallback } from 'react';
import { Search } from 'teespace-core';
import styled from 'styled-components';
import { Button, Modal, Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import AddFriendsByInvitationDialog from './AddFriendsByInvitationDialog';
import NoFriendModalImg from '../../assets/no_friends.svg';
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
  padding: 0.63rem 0.94rem 0.56rem;
  &:hover {
    .ant-input-prefix {
      .anticon {
        color: #49423a;
      }
    }
  }

  &.ant-input-affix-wrapper {
    .ant-input-prefix {
      .anticon {
        color: #7c7670;
      }
    }
  }

  .ant-input-prefix {
    .anticon {
      color: #cac4bd;
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
    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: #fff;
      border: 1px solid #6c56e5;
    }
  }
`;

const InvitationForm = styled.div`
  width: 100%;
  padding: 2.5rem 0 3.69rem;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
`;

const StyledInfoText = styled.p`
  margin-bottom: 0.63rem;
  font-size: 0.94rem;
  word-break: break-all;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.38rem;
`;

const StyledSubInfoText = styled.p`
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  word-break: break-all;
  color: #696969;
  letter-spacing: 0;
  text-align: center;
  line-height: 1.13rem;
`;

const StyledInfoImg = styled.img`
  width: 8.13rem;
  margin-bottom: 1rem;
`;

const StyledButton = styled(Button)`
    width: 5.13rem;
    height: 1.88rem;
    font-size: 0.75rem;
    background-color:
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
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
  const { t } = useTranslation();
  const [isInviteDialogVisible, setIsInviteDialogVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [valueText, setValueText] = useState('');
  const timestamp = useRef(Date.now());
  const isSpaceEmpty = spaceMemberList?.length === 1;

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
  const handleSearch = event => {
    const targetText = event.target.value;
    setSearchText(targetText);
  };
  const handleCancelIconClick = () => {
    setSearchText('');
    setValueText('');
  };

  const handleCancelInvite = () => {
    setSearchText('');
    setValueText('');
    onCancelAddFriends();
  };

  return (
    <>
      <StyledModal
        visible={visible}
        mask
        maskTransitionName=""
        centered
        footer={null}
        width="24.38rem"
        height="25.38rem"
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
        {isSpaceEmpty && !isViewMode ? (
          <InvitationForm>
            <StyledInfoImg src={NoFriendModalImg} alt="" />
            <StyledInfoText>{t('CM_ADD_FRIENDS_EMPTY_01')}</StyledInfoText>
            <StyledSubInfoText>
              {t('CM_ADD_FRIENDS_EMPTY_02')}
            </StyledSubInfoText>
            <StyledButton type="solid" onClick={handleInviteMember}>
              {t('CM_USER_INVITE')}
            </StyledButton>
          </InvitationForm>
        ) : (
          <AddFriendSearchForm>
            <SearchBox>
              <StyledSearch
                placeholder={
                  isOrgExist
                    ? t('CM_SEARCH_TEAM_USER_NAME_04')
                    : t('CM_USER_LIST_SEARCH')
                }
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

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import AddFriendsByOrganization from '../friends/AddFriendsByOrganization';
import AddFriendsFromSpace from './AddFriendsFromSpace';
import AddFriendsByInvitationDialog from './AddFriendsByInvitationDialog';
import {
  StyledModal,
  AddFriendSearchForm,
  SearchBox,
  StyledSearch,
  InvitationForm,
  StyledInfoText,
  StyledSubInfoText,
  StyledInfoImg,
  StyledButton,
  Logo,
} from '../../styles/addfriends/AddFriendsBySearchStyle';
import NoFriendModalImg from '../../assets/no_friends.svg';

const AddFriendsBySearch = ({
  title,
  isOrgExist,
  spaceMemberList,
  isViewMode,
  onCancelAddFriends,
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isInviteDialogVisible, setIsInviteDialogVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const isSpaceEmpty = spaceMemberList?.length === 1;

  const handleInviteMember = () => {
    setIsModalVisible(false);
    setIsInviteDialogVisible(true);
  };

  const handleSearchText = debounce(inputText => {
    setSearchText(inputText);
  }, 200);
  const handleChangeSearchText = e => {
    const targetText = e.target.value;
    handleSearchText(targetText);
  };
  const handleCancelIconClick = () => {
    setSearchText('');
  };

  return (
    <>
      {isModalVisible && (
        <StyledModal
          visible
          mask
          maskTransitionName=""
          centered
          footer={null}
          width="24.38rem"
          height="30.18rem"
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
          onCancel={onCancelAddFriends}
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
                  onClear={handleCancelIconClick}
                  onChange={handleChangeSearchText}
                />
              </SearchBox>
              {isOrgExist ? (
                <AddFriendsByOrganization
                  searchText={searchText}
                  isViewMode={isViewMode}
                />
              ) : (
                <AddFriendsFromSpace
                  spaceMembers={spaceMemberList}
                  searchText={searchText}
                  isViewMode={isViewMode}
                />
              )}
            </AddFriendSearchForm>
          )}
        </StyledModal>
      )}
      {isInviteDialogVisible && (
        <AddFriendsByInvitationDialog onCancel={onCancelAddFriends} />
      )}
    </>
  );
};

export default AddFriendsBySearch;

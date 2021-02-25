import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { useCoreStores, logEvent, WaplSearch } from 'teespace-core';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import AddFriendsBySearch from './AddFriendsBySearch';
import { handleFriendsDialogType } from '../../utils/FriendsUtil';
import FriendAddIcon from '../../assets/add_friends.svg';

/**
 * Friends LNB Header
 * @param {Object} props
 * @param {function} props.handleInputChange
 */

const SearchBox = styled.div`
  display: flex;
  align-items: center;
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
    &::placeholder {
      color: #bcbcbc;
    }
  }
`;
const FriendSearch = styled(WaplSearch)`
  &.friendSearch {
    display: flex;
    flex: 1 1 0%;
    margin-right: 0.63rem;
    height: 1.75rem;
    padding: 0;
    border-width: 0 0 0.06rem 0;
  }
`;
const FriendAddButton = styled.div`
  display: flex;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  &:hover {
    background: #eae6e0;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  }
  & > img {
    width: 1.34rem;
    height: 1.34rem;
  }
`;

function FriendsLNBHeader({ handleInputChange, handleInputClear }) {
  const { t } = useTranslation();
  const { orgStore, userStore, spaceStore, authStore } = useCoreStores();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isOrgExist, setIsOrgExist] = useState(false);
  const [spaceMemberList, setSpaceMemberList] = useState([]);

  const handleOpenAddFriendsDialog = useCallback(async () => {
    try {
      await handleFriendsDialogType(
        orgStore,
        userStore.myProfile,
        authStore.sessionInfo?.domainKey,
        () => setIsOrgExist(true),
        res => setSpaceMemberList(res),
      );
      setIsDialogVisible(!isDialogVisible);
      logEvent('main', 'clickAddFriendsBtn');
    } catch (e) {
      console.log('Friends Add Service Error..');
    }
  }, [orgStore, userStore, authStore, isDialogVisible]);

  const handleCloseAddFriendsDialog = useCallback(async () => {
    setIsDialogVisible(!isDialogVisible);
  }, [isDialogVisible]);

  return useObserver(() => (
    <SearchBox>
      <FriendSearch
        className="friendSearch"
        type="underline"
        searchIconColor={{ active: '#17202B', default: '#C6CED6' }}
        clearIconColor={{ active: '#17202B', default: '#C6CED6' }}
        onChange={handleInputChange}
        onClear={handleInputClear}
        placeholder={t('WEB_COMMON_B2C_LNB_EMPTY_PAGE_06')}
        isCountExist={false}
      />
      <Tooltip
        title={t('WEB_COMMON_B2C_LNB_EMPTY_PAGE_02')}
        placement="bottomLeft"
        color="#232D3B"
      >
        <FriendAddButton onClick={handleOpenAddFriendsDialog}>
          <img alt="friend" src={FriendAddIcon} />
        </FriendAddButton>
      </Tooltip>
      <AddFriendsBySearch
        visible={isDialogVisible}
        onCancelAddFriends={handleCloseAddFriendsDialog}
        isOrgExist={isOrgExist}
        title={t('WEB_COMMON_B2C_LNB_EMPTY_PAGE_02')}
        isViewMode={false}
        spaceInfo={spaceStore.currentSpace}
        spaceMemberList={spaceMemberList}
      />
    </SearchBox>
  ));
}

export default FriendsLNBHeader;

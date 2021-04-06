import React, { useState, useCallback } from 'react';
import { useCoreStores, logEvent } from 'teespace-core';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import AddFriendsBySearch from './AddFriendsBySearch';
import { handleFriendsDialogType } from '../../utils/FriendsUtil';
import FriendAddIcon from '../../assets/add_friends.svg';
import {
  SearchBox,
  FriendSearch,
  FriendAddButton,
} from '../../styles/friends/FriendsLNBHeaderStyle';

/**
 * @param {function} props.handleInputChange - 검색 값 change
 * @param {function} props.handleInputClear - 검색 값 clear
 */

const FriendsLNBHeader = ({ handleInputChange, handleInputClear }) => {
  const { t } = useTranslation();
  const { spaceStore } = useCoreStores();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isOrgExist, setIsOrgExist] = useState(false);
  const [spaceMemberList, setSpaceMemberList] = useState([]);

  const handleOpenAddFriendsDialog = useCallback(async () => {
    try {
      await handleFriendsDialogType(
        () => setIsOrgExist(true),
        res => setSpaceMemberList(res),
      );
      setIsDialogVisible(true);
      logEvent('main', 'clickAddFriendsBtn');
    } catch (e) {
      console.log('Org/Member Get Service Error');
    }
  }, []);

  const handleCloseAddFriendsDialog = useCallback(() => {
    setIsDialogVisible(false);
  }, []);

  return (
    <SearchBox>
      <FriendSearch
        className="friendSearch"
        type="underline"
        searchIconColor={{ active: '#000', default: '#000' }}
        clearIconColor={{ active: '#17202B', default: '#C6CED6' }}
        onChange={handleInputChange}
        onClear={handleInputClear}
        placeholder={t('CM_B2C_LNB_EMPTY_PAGE_06')}
        isCountExist={false}
      />
      <Tooltip
        title={t('CM_ADD_PHOTO_FRIENDS')}
        placement="bottomLeft"
        color="#232D3B"
      >
        <FriendAddButton
          className="friends__add-button"
          onClick={handleOpenAddFriendsDialog}
        >
          <img alt="friend" src={FriendAddIcon} />
        </FriendAddButton>
      </Tooltip>
      <AddFriendsBySearch
        visible={isDialogVisible}
        onCancelAddFriends={handleCloseAddFriendsDialog}
        isOrgExist={isOrgExist}
        title={t('CM_ADD_PHOTO_FRIENDS')}
        isViewMode={false}
        spaceInfo={spaceStore.currentSpace}
        spaceMemberList={spaceMemberList}
      />
    </SearchBox>
  );
};

export default FriendsLNBHeader;

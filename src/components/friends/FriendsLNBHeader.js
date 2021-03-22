import React, { useState, useCallback } from 'react';
import { useObserver } from 'mobx-react';
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
} from '../../styles/friend/FriendsLnbHeaderStyle';

/**
 * Friends LNB Header
 * @param {Object} props
 * @param {function} props.handleInputChange
 */

const FriendsLNBHeader = ({ handleInputChange, handleInputClear }) => {
  const { spaceStore } = useCoreStores();
  const { t } = useTranslation();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isOrgExist, setIsOrgExist] = useState(false);
  const [spaceMemberList, setSpaceMemberList] = useState([]);

  const handleOpenAddFriendsDialog = useCallback(async () => {
    try {
      await handleFriendsDialogType(
        () => setIsOrgExist(true),
        res => setSpaceMemberList(res),
      );
      setIsDialogVisible(!isDialogVisible);
      logEvent('main', 'clickAddFriendsBtn');
    } catch (e) {
      console.log('Org/Member Get Service Error');
    }
  }, [isDialogVisible]);

  const handleCloseAddFriendsDialog = () => {
    setIsDialogVisible(!isDialogVisible);
  };

  return useObserver(() => (
    <SearchBox>
      <FriendSearch
        className="friendSearch"
        type="underline"
        searchIconColor={{ active: '#17202B', default: '#C6CED6' }}
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
  ));
};

export default FriendsLNBHeader;

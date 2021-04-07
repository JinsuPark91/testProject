import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { logEvent } from 'teespace-core';
import { Tooltip } from 'antd';
import AddFriendsBySearch from './AddFriendsBySearch';
import { handleFriendsDialogType } from '../../utils/FriendsUtil';
import { FriendAddButton } from '../../styles/friends/FriendsLNBHeaderStyle';
import FriendAddIcon from '../../assets/add_friends.svg';

const AddFriendsButton = () => {
  const { t } = useTranslation();
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);
  const [isOrgExist, setIsOrgExist] = useState(false);
  const [spaceMemberList, setSpaceMemberList] = useState([]);

  const handleOpenAddFriendsDialog = useCallback(async () => {
    try {
      await handleFriendsDialogType(
        () => setIsOrgExist(true),
        res => setSpaceMemberList(res),
      );
      setIsAddFriendModalVisible(true);
      logEvent('main', 'clickAddFriendsBtn');
    } catch (e) {
      console.log('Org/Member Get Error');
    }
  }, []);

  return (
    <>
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
      {isAddFriendModalVisible && (
        <AddFriendsBySearch
          title={t('CM_ADD_PHOTO_FRIENDS')}
          isOrgExist={isOrgExist}
          spaceMemberList={spaceMemberList}
          isViewMode={false}
          onCancelAddFriends={() => setIsAddFriendModalVisible(false)}
        />
      )}
    </>
  );
};

export default AddFriendsButton;

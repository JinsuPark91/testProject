import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { logEvent, AddFriendsBySearch } from 'teespace-core';
import { Tooltip } from 'antd';
import { FriendAddButton } from '../../styles/friends/FriendsLNBHeaderStyle';
import FriendAddIcon from '../../assets/add_friends.svg';

const AddFriendsButton = () => {
  const { t } = useTranslation();
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);

  const handleOpenAddFriendsDialog = useCallback(async () => {
    try {
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
          isViewMode={false}
          onCancelAddFriends={() => setIsAddFriendModalVisible(false)}
        />
      )}
    </>
  );
};

export default AddFriendsButton;

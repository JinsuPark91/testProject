import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { logEvent, AddFriendsBySearch } from 'teespace-core';
import { Tooltip } from 'antd';
import { FriendAddButton } from '../../styles/friends/FriendsLNBHeaderStyle';
import FriendAddIcon from '../../assets/add_friends.svg';

const AddButton = React.memo(({ onOpen }) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      title={t('CM_ADD_PHOTO_FRIENDS')}
      placement="bottomLeft"
      color="#4C535D"
    >
      <FriendAddButton className="friends__add-button" onClick={onOpen}>
        <img alt="friend" src={FriendAddIcon} />
      </FriendAddButton>
    </Tooltip>
  );
});

const AddFriendsButton = () => {
  const [isAddFriendModalVisible, setIsAddFriendModalVisible] = useState(false);

  const handleOpenFriendsModal = useCallback(() => {
    setIsAddFriendModalVisible(true);
    logEvent('main', 'clickAddFriendsBtn');
  }, []);

  return (
    <>
      <AddButton onOpen={handleOpenFriendsModal} />
      {isAddFriendModalVisible && (
        <AddFriendsBySearch
          isViewMode={false}
          onCancelAddFriends={() => setIsAddFriendModalVisible(false)}
          isTopOrg={false}
        />
      )}
    </>
  );
};

export default AddFriendsButton;

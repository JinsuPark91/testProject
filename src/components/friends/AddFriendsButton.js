import React, { useState, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { logEvent, AddFriendsBySearch } from 'teespace-core';
import { Tooltip } from 'antd';
import { ThemeContext } from 'styled-components';
import { FriendAddButton } from '../../styles/friends/FriendsLNBHeaderStyle';
import { AddAcountIcon } from '../Icons';

const AddButton = React.memo(({ onOpen }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);

  return (
    <Tooltip
      title={t('CM_ADD_PHOTO_FRIENDS')}
      placement="bottomLeft"
      color={themeContext.CoreLight}
    >
      <FriendAddButton className="friends__add-button" onClick={onOpen}>
        <AddAcountIcon
          width={1.38}
          height={1.38}
          color={themeContext.IconNormal2}
        />
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
          isMeVisible={false}
        />
      )}
    </>
  );
};

export default AddFriendsButton;

import React, { useState, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { logEvent, AddFriendsBySearch, Tooltip } from 'teespace-core';
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
  const [addFriendModalVisible, setAddFriendModalVisible] = useState(false);

  const handleOpen = useCallback(() => {
    setAddFriendModalVisible(true);
    logEvent('main', 'clickAddFriendsBtn');
  }, []);
  const handleClose = useCallback(() => {
    setAddFriendModalVisible(false);
  }, []);

  return (
    <>
      <AddButton onOpen={handleOpen} />
      {addFriendModalVisible && (
        <AddFriendsBySearch
          isViewMode={false}
          onCancelAddFriends={handleClose}
          isTopOrg={false}
          isMeVisible={false}
        />
      )}
    </>
  );
};

export default AddFriendsButton;

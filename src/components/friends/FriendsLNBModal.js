import React from 'react';
import { ProfileInfoModal, Toast, AddFriendsBySearch } from 'teespace-core';
import { useStores } from '../../stores';

const FriendsLNBModal = ({
  infoModalVisible,
  handleCloseInfoModal,
  selectedId,
  toastVisible,
  handleCloseToast,
  toastText,
  memberModalVisible,
  handleCloseMemberModal,
}) => {
  const { uiStore } = useStores();
  return (
    <>
      {infoModalVisible && (
        <ProfileInfoModal
          userId={selectedId}
          visible={infoModalVisible}
          onClickMeeting={_roomId => {
            uiStore.openWindow({
              id: _roomId,
              type: 'meeting',
              name: null,
              userCount: null,
              handler: null,
            });
          }}
          onClose={handleCloseInfoModal}
          position={{ left: '16.81rem' }}
        />
      )}
      <Toast visible={toastVisible} timeoutMs={1000} onClose={handleCloseToast}>
        {toastText}
      </Toast>
      {memberModalVisible && (
        <AddFriendsBySearch
          isViewMode
          onCancelAddFriends={handleCloseMemberModal}
          isTopOrg
        />
      )}
    </>
  );
};

export default React.memo(FriendsLNBModal);

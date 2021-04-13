import React from 'react';
import { ProfileInfoModal, Toast } from 'teespace-core';
import PlatformUIStore from '../../stores/PlatformUIStore';

const FriendsLNBModal = ({
  infoModalVisible,
  handleCloseInfoModal,
  selectedId,
  toastVisible,
  handleCloseToast,
  toastText,
}) => {
  return (
    <>
      {infoModalVisible && (
        <ProfileInfoModal
          userId={selectedId}
          visible={infoModalVisible}
          onClickMeeting={_roomId => {
            PlatformUIStore.openWindow({
              id: _roomId,
              type: 'meeting',
              name: null,
              userCount: null,
              handler: null,
            });
          }}
          onClose={() => handleCloseInfoModal(false)}
          position={{ left: '16.81rem' }}
        />
      )}
      <Toast visible={toastVisible} timeoutMs={1000} onClose={handleCloseToast}>
        {toastText}
      </Toast>
    </>
  );
};

export default React.memo(FriendsLNBModal);

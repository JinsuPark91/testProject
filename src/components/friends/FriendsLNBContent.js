import React, { useState, useCallback } from 'react';
import { ProfileInfoModal } from 'teespace-core';
import FriendsLNBList from './FriendsLNBList';
import { useStores } from '../../stores';
import { getLeftDistance } from '../../utils/GeneralUtil';

/**
 * @param {string} searchKeyword - 프렌즈 검색 키워드
 * @param {function} handleShadow - scroll 최하단일때 호출
 */

const FriendsLNBContent = ({ searchKeyword, handleShadow }) => {
  const { uiStore } = useStores();
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const handleOpenInfoModal = useCallback(value => {
    setSelectedId(value);
    setIsInfoModalVisible(true);
  }, []);

  const handleOpenToast = useCallback(value => {
    uiStore.openToast({
      text: value,
      onClose: () => {
        uiStore.closeToast();
      },
    });
  }, []);

  return (
    <>
      <FriendsLNBList
        searchKeyword={searchKeyword}
        handleShadow={handleShadow}
        handleOpenInfoModal={handleOpenInfoModal}
        handleOpenToast={handleOpenToast}
      />
      {isInfoModalVisible && (
        <ProfileInfoModal
          userId={selectedId}
          visible={isInfoModalVisible}
          onClickMeeting={_roomId => {
            uiStore.openWindow({
              id: _roomId,
              type: 'meeting',
              name: null,
              userCount: null,
              handler: null,
            });
          }}
          onClose={() => setIsInfoModalVisible(false)}
          position={{ left: getLeftDistance() }}
        />
      )}
    </>
  );
};

export default React.memo(FriendsLNBContent);

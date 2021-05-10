import React, { useState, useCallback } from 'react';
import { ProfileInfoModal, Toast } from 'teespace-core';
import FriendsLNBList from './FriendsLNBList';
import { useStores } from '../../stores';

/**
 * @param {string} searchKeyword - 프렌즈 검색 키워드
 * @param {function} handleShadow - scroll 최하단일때 호출
 */

const FriendsLNBContent = ({ searchKeyword, handleShadow }) => {
  const { uiStore } = useStores();

  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');

  const handleOpenInfoModal = useCallback(() => {
    setIsInfoModalVisible(true);
  }, []);
  const handleSelectedId = useCallback(value => {
    setSelectedId(value);
  }, []);

  const handleOpenToast = useCallback(() => {
    setIsToastVisible(true);
  }, []);
  const handleToastText = useCallback(value => {
    setToastText(value);
  }, []);

  return (
    <>
      <FriendsLNBList
        searchKeyword={searchKeyword}
        handleShadow={handleShadow}
        handleOpenInfoModal={handleOpenInfoModal}
        handleSelectedId={handleSelectedId}
        handleOpenToast={handleOpenToast}
        handleToastText={handleToastText}
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
          position={{ left: '16.81rem' }}
        />
      )}
      {isToastVisible && (
        <Toast
          visible={isToastVisible}
          timeoutMs={1000}
          onClose={() => setIsToastVisible(false)}
        >
          {toastText}
        </Toast>
      )}
    </>
  );
};

export default React.memo(FriendsLNBContent);

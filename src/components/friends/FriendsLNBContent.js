import React, { useState, useCallback } from 'react';
import FriendsLNBList from './FriendsLNBList';
import FriendsLNBModal from './FriendsLNBModal';

/**
 * @param {string} searchKeyword - 프렌즈 검색 키워드
 * @param {function} handleShadow - scroll 최하단일때 호출
 */

const FriendsLNBContent = ({ searchKeyword, handleShadow }) => {
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');

  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);

  const handleInfoModalVisible = useCallback(value => {
    setIsInfoModalVisible(value);
  }, []);
  const handleSelectedId = useCallback(value => {
    setSelectedId(value);
  }, []);

  const handleToastVisible = useCallback(value => {
    setIsToastVisible(value);
  }, []);
  const handleToastText = useCallback(value => {
    setToastText(value);
  }, []);

  const handleMemberModalVisible = useCallback(value => {
    setIsMemberModalVisible(value);
  }, []);

  return (
    <>
      <FriendsLNBList
        searchKeyword={searchKeyword}
        handleShadow={handleShadow}
        handleInfoModalVisible={handleInfoModalVisible}
        handleSelectedId={handleSelectedId}
        handleToastVisible={handleToastVisible}
        handleToastText={handleToastText}
        handleMemberModalVisible={handleMemberModalVisible}
      />
      <FriendsLNBModal
        infoModalVisible={isInfoModalVisible}
        handleCloseInfoModal={() => handleInfoModalVisible(false)}
        selectedId={selectedId}
        toastVisible={isToastVisible}
        handleCloseToast={() => handleToastVisible(false)}
        toastText={toastText}
        memberModalVisible={isMemberModalVisible}
        handleCloseMemberModal={() => setIsMemberModalVisible(false)}
      />
    </>
  );
};

export default React.memo(FriendsLNBContent);

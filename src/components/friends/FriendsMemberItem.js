import React, { useState, useCallback } from 'react';
import { useCoreStores, AddFriendsBySearch } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import {
  MemberItemWrapper,
  GroupAvatar,
} from '../../styles/friends/FriendsLNBContentStyle';
import {
  FriendItemWrapper,
  TextComponentBox,
  TextWrapper,
  TitleForName,
} from '../../styles/friends/FriendItemStyle';
import { GroupIcon } from '../Icons';

const MemberViewItem = React.memo(({ noFriend, handleOpen }) => {
  const { t } = useTranslation();
  return (
    <MemberItemWrapper noFriend={noFriend}>
      <FriendItemWrapper mode="member" onClick={handleOpen}>
        <GroupAvatar>
          <GroupIcon width={1.25} height={1.25} color="#fff" />
        </GroupAvatar>
        <TextWrapper>
          <TextComponentBox>
            <TitleForName>{t('CM_VIEW_ALL_USER')}</TitleForName>
          </TextComponentBox>
        </TextWrapper>
      </FriendItemWrapper>
    </MemberItemWrapper>
  );
});

const FriendsMemberItem = () => {
  const { friendStore } = useCoreStores();
  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);

  const handleOpenMemberModal = useCallback(() => {
    setIsMemberModalVisible(true);
  }, []);

  return (
    <>
      <MemberViewItem
        noFriend={!friendStore.friendInfoList.length}
        handleOpen={handleOpenMemberModal}
      />
      {isMemberModalVisible && (
        <AddFriendsBySearch
          isViewMode={false}
          onCancelAddFriends={() => setIsMemberModalVisible(false)}
          isTopOrg
          isMeVisible
        />
      )}
    </>
  );
};

export default FriendsMemberItem;

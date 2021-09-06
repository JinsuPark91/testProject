import React, { useState } from 'react';
import { Observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Divider } from 'antd';
import { useCoreStores } from 'teespace-core';
import MobileFriendHeader from './MobileFriendHeader';
import MobileFriendItem from './MobileFriendItem';

const MyItem = React.memo(() => {
  const { userStore } = useCoreStores();
  const { myProfile } = userStore;

  return (
    <>
      <MyInfoBox>
        <MyInfoItem friendInfo={myProfile} isMe />
      </MyInfoBox>
      <ListDivider />
    </>
  );
});

const MobileFriend = () => {
  const { t } = useTranslation();
  const { friendStore } = useCoreStores();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditMode = () => setIsEditMode(!isEditMode);

  return (
    <>
      <MobileFriendHeader
        isEditMode={isEditMode}
        handleEditMode={handleEditMode}
      />
      <FriendListBox>
        <Observer>
          {() => {
            const friendList = friendStore.friendInfoList;
            const friendNum = friendList.length;
            const noFriend = friendList.length === 0;

            return (
              <>
                <MyItem />
                {noFriend ? (
                  <NoFriendText>
                    {t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_04')}
                  </NoFriendText>
                ) : (
                  <>
                    <FriendListHeader>
                      <FriendTitle>{t('CM_FRIENDS')}</FriendTitle>
                      <Num>{friendNum}</Num>
                    </FriendListHeader>
                    {friendList.map(friendInfo => (
                      <MobileFriendItem
                        key={friendInfo?.friendId || friendInfo?.id}
                        friendInfo={friendInfo}
                        isMe={false}
                        isEditMode={isEditMode}
                      />
                    ))}
                  </>
                )}
              </>
            );
          }}
        </Observer>
      </FriendListBox>
    </>
  );
};

export default MobileFriend;

const FriendListHeader = styled.div`
  line-height: 0;
  margin: 0 1rem 0.5rem;
`;
const FriendTitle = styled.p`
  display: inline-block;
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #48423b;
  letter-spacing: 0;
  margin-right: 0.25rem;
  user-select: none;
`;
const Num = styled.span`
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: rgba(19, 19, 19, 0.5);
  letter-spacing: 0;
  user-select: none;
`;
const ListDivider = styled(Divider)`
  background-color: #f1f2f4;
  margin: 0.5rem 0.63rem;
  width: auto;
  min-width: auto;
`;
const FriendListBox = styled.div`
  overflow-y: auto;
  height: 100%;
`;
const MyInfoBox = styled.div`
  margin-top: 0.5rem;
`;
const MyInfoItem = styled(MobileFriendItem)`
  padding: 0 1rem;
`;
const NoFriendText = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { talkOnDrop, Talk } from 'teespace-talk-app';
import { useDrop } from 'react-dnd';
import { observer } from 'mobx-react';
import { Button, Tooltip } from 'antd';
import {
  useCoreStores,
  Dropdown,
  Menu,
  Message,
  usePortalWindow,
} from 'teespace-core';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Wrapper,
  FriendItemWrapper,
  ProfileWrapper,
  TextWrapper,
  TitleForName,
  ActionWrapper,
  StyledWrapper,
  NewFriendBadge,
  StyledAvatar,
  MeWrapper,
  MoreIconWrapper,
} from '../../styles/friend/FriendItemStyle';
import { ACCEPT_ITEMS, TALK_ACCEPT_ITEMS } from '../../utils/DndConstant';
import { handleCheckNewFriend } from '../../utils/FriendsUtil';
import { handleProfileMenuClick } from '../../utils/ProfileUtil';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { ViewMoreIcon, ExportIcon } from '../Icons';
import mySign from '../../assets/wapl_me.svg';

const DropdownMenu = React.memo(
  ({
    friendFavorite,
    handleCancelBookmark,
    handleAddBookmark,
    handleRemoveFriendMessageOpen,
  }) => (
    <Menu>
      {friendFavorite && (
        <Menu.Item onClick={handleCancelBookmark}>즐겨찾기 해제</Menu.Item>
      )}
      {!friendFavorite && (
        <Menu.Item onClick={handleAddBookmark}>즐겨찾기</Menu.Item>
      )}
      <Menu.Item onClick={handleRemoveFriendMessageOpen}>프렌즈 삭제</Menu.Item>
    </Menu>
  ),
);

const Profile = React.memo(
  ({ mode, tooltipPopupContainer, profilePhoto, itemId, handleClickPhoto }) => {
    return (
      <>
        {mode === 'me' && (
          <StyledWrapper>
            <StyledAvatar mode="me" onClick={e => handleClickPhoto(e, itemId)}>
              <img src={profilePhoto} alt="" />
            </StyledAvatar>
          </StyledWrapper>
        )}
        {mode !== 'me' && (
          <StyledAvatar mode={mode} onClick={e => handleClickPhoto(e, itemId)}>
            <img src={profilePhoto} alt="" />
          </StyledAvatar>
        )}
      </>
    );
  },
);

const FriendAction = React.memo(
  ({ mode, menu, dropdownVisible, handleDropdownVisible }) => {
    return (
      <>
        {mode === 'friend' && (
          <>
            <Dropdown
              overlay={menu}
              trigger={['click']}
              onClick={e => e.stopPropagation()}
            >
              <MoreIconWrapper className="friend-more-icon">
                <ViewMoreIcon />
              </MoreIconWrapper>
            </Dropdown>
          </>
        )}
      </>
    );
  },
);

const OpenMiniTalk = roomInfo => {
  //  FIXME: 안정화 후 함수로 묶기
  PlatformUIStore.openWindow({
    id: roomInfo.id,
    type: 'talk',
    name: roomInfo.name,
    userCount: roomInfo.userCount,
    handler: null,
  });
};

const MeAction = React.memo(({ mode, itemId }) => {
  const { userStore } = useCoreStores();
  const handleExport = async e => {
    e.stopPropagation();
    const myUserId = userStore.myProfile.id;
    handleProfileMenuClick(
      myUserId,
      itemId,
      roomInfo => OpenMiniTalk(roomInfo),
      roomInfo => OpenMiniTalk(roomInfo),
      newRoomInfo => OpenMiniTalk(newRoomInfo),
    );
  };

  return (
    <Tooltip placement="top" title="미니 채팅" color="#232D3B">
      <MoreIconWrapper className="friend-export-icon" onClick={handleExport}>
        <ExportIcon />
      </MoreIconWrapper>
    </Tooltip>
  );
});

const AddFriendAction = React.memo(
  ({ mode, friendRelation, handleAddFriend, isMe }) => (
    <>
      {mode === 'addFriend' && !friendRelation && !isMe && (
        <Button
          shape="circle"
          icon={<PlusOutlined onClick={handleAddFriend} />}
        />
      )}
    </>
  ),
);

const RecommendedAction = React.memo(
  ({ mode, friendRelation, handleAddFriend }) => (
    <>
      {mode === 'recommended' && !friendRelation && (
        <>
          <Button
            shape="circle"
            icon={<PlusOutlined onClick={handleAddFriend} />}
          />
          <Button shape="circle" icon={<CloseOutlined />} />
        </>
      )}
    </>
  ),
);

const Action = React.memo(
  ({
    mode,
    menu,
    dropdownVisible,
    handleDropdownVisible,
    handleTalkWindowOpen,
    friendRelation,
    handleAddFriend,
    isMe,
    itemId,
  }) => (
    <>
      {mode !== 'readOnly' && (
        <>
          <FriendAction
            mode={mode}
            menu={menu}
            dropdownVisible={dropdownVisible}
            handleDropdownVisible={handleDropdownVisible}
            handleTalkWindowOpen={handleTalkWindowOpen}
          />
          <MeAction mode={mode} itemId={itemId} />
          <AddFriendAction
            mode={mode}
            friendRelation={friendRelation}
            handleAddFriend={handleAddFriend}
            isMe={isMe}
          />
          <RecommendedAction
            mode={mode}
            friendRelation={friendRelation}
            handleAddFriend={handleAddFriend}
          />
        </>
      )}
    </>
  ),
);

const TextComponent = React.memo(
  ({ displayName, fullCompanyJob, mode, orgName, position }) => {
    const fullDisplayName = (() => {
      switch (mode) {
        // friends LNB
        case 'me':
        case 'friend': {
          const fullCompanyJobTxt = fullCompanyJob ? `(${fullCompanyJob})` : '';
          return `${displayName} ${fullCompanyJobTxt}`;
        }
        case 'addFriend': // organization
          if (orgName && position) {
            return `${displayName} (${orgName}·${position})`;
          }
          return displayName;
        default:
          return displayName;
      }
    })();

    return (
      <>
        {mode === 'me' && (
          <MeWrapper>
            <img src={mySign} alt="me" />
          </MeWrapper>
        )}
        <TitleForName>{fullDisplayName}</TitleForName>
      </>
    );
  },
);

/**
 * A friend item component to use in the list view.
 * @param {Object} props
 * @param {('me'|'friend'|'readOnly'|'addFriend'|'recommended')} props.mode
 * @param {function} props.tooltipPopupContainer
 * @param {UserModel} props.friendInfo
 */
const FriendItem = observer(
  ({
    mode = 'friend', // 'me', 'friend' // 추후: 'readOnly', 'addFriend', 'recommended'
    isActive = false,
    onClick,
    tooltipPopupContainer = () => document.body,
    friendInfo,
    style,
    openToast,
    setToastText,
    setSelectedId,
    toggleInfoModal,
    setyPosition,
  }) => {
    const {
      displayName,
      friendFavorite = false,
      friendId = '',
      id: userId = '',
      orgName,
      position,
    } = friendInfo;
    const fullCompanyJob = friendInfo.getFullCompanyJob({ format: 'friend' });
    const history = useHistory();
    const { friendStore, userStore, roomStore } = useCoreStores();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [
      visibleRemoveFriendMessage,
      setVisibleRemoveFriendMessage,
    ] = useState(false);

    const myUserId = userStore.myProfile.id;
    const itemId = friendId || userId;
    const isMe = itemId === myUserId;
    const isNewFriend = handleCheckNewFriend(friendInfo);

    // const [{ canDrop, isOver }, drop] = useDrop({
    //   accept: ACCEPT_ITEMS,
    //   drop: item => {
    //     let targetRoomInfo = {};
    //     const setRoomInfo = roomInfo => {
    //       targetRoomInfo = roomInfo;
    //     };
    //     handleProfileMenuClick(
    //       roomStore,
    //       myUserId,
    //       itemId,
    //       roomInfo => setRoomInfo(roomInfo),
    //       roomInfo => setRoomInfo(roomInfo),
    //       roomInfo => setRoomInfo(roomInfo),
    //     );
    //     if (TALK_ACCEPT_ITEMS.includes(item.type)) {
    //       const type = /[a-zA-Z]+:([a-zA-Z]+):[a-zA-Z]+/.exec(
    //         item.type.toLowerCase(),
    //       );
    //       talkOnDrop({
    //         room: targetRoomInfo,
    //         data: item.data,
    //         type: type[1] ? type[1] : 'unknown',
    //         currentRoomId: targetRoomInfo?.id,
    //       });
    //     }

    //     return {
    //       source: item.type,
    //       sourceData: item.data,
    //       target: 'Platform:Room', // 프렌즈 리스트에 drop이지만 Room에 drop과 사실상 동일해 보인다.
    //       targetData: targetRoomInfo,
    //     };
    //   },
    //   collect: monitor => {
    //     return {
    //       isOver: monitor.isOver(),
    //       canDrop: monitor.canDrop(),
    //     };
    //   },
    // });
    const isDndHover = false; // canDrop && isOver;

    const handleSelectPhoto = (e, id = '') => {
      setyPosition(e.clientY);
      if (e) e.stopPropagation();
      if (id) {
        setSelectedId(id);
        toggleInfoModal(true);
      } else {
        toggleInfoModal(false);
      }
    };

    const talkWindowOpen = usePortalWindow();

    const handleTalkWindowOpen = async e => {
      if (e) e.stopPropagation();
      try {
        const targetId = friendInfo.friendId || myUserId;
        const { roomInfo } = await roomStore.getDMRoom(myUserId, targetId);

        if (roomInfo) {
          if (!roomInfo.isVisible) {
            await roomStore.updateRoomMemberSetting({
              roomId: roomInfo.id,
              myUserId,
              newIsVisible: true,
            });
          }
          talkWindowOpen({
            element: (
              <Talk
                roomId={roomInfo.id}
                channelId={
                  roomStore
                    .getRoomMap()
                    .get(roomInfo.id)
                    ?.channelList?.find(channel => channel.type === 'CHN0001')
                    ?.id
                }
              />
            ),
            opts: 'width=600, height=900',
            title: 'mini-talk',
          });
        } else {
          const { dmRoomId } = await roomStore.createRoom({
            creatorId: myUserId,
            userList:
              myUserId === targetId
                ? [{ userId: myUserId }]
                : [{ userId: myUserId }, { userId: targetId }],
          });
          talkWindowOpen({
            element: (
              <Talk
                roomId={dmRoomId}
                channelId={
                  roomStore
                    .getRoomMap()
                    .get(dmRoomId)
                    ?.channelList?.find(channel => channel.type === 'CHN0001')
                    ?.id
                }
              />
            ),
            opts: 'width=600, height=900',
            title: 'mini-talk',
          });
        }
      } catch (e) {
        console.error(`Error is${e}`);
      }
    };

    const handleDropdownVisible = useCallback(visible => {
      setDropdownVisible(visible);
    }, []);

    const handleAddBookmark = useCallback(
      async ({ domEvent: e }) => {
        e.stopPropagation();
        try {
          await friendStore.setFriendFavorite({
            myUserId,
            friendId: itemId,
            isFav: true,
          });
        } catch (error) {
          console.log(error);
        }
        setDropdownVisible(false);
        setToastText('즐겨찾기가 설정되었습니다.');
        openToast();
      },
      [friendStore, itemId, setToastText, openToast, myUserId],
    );

    const handleCancelBookmark = useCallback(
      async ({ domEvent: e }) => {
        e.stopPropagation();
        await friendStore.setFriendFavorite({
          myUserId,
          friendId: itemId,
          isFav: false,
        });
        setToastText('즐겨찾기가 해제되었습니다.');
        setDropdownVisible(false);
        openToast();
      },
      [friendStore, myUserId, itemId, setToastText, openToast],
    );

    const handleMoveItem = useCallback(
      targetId => {
        if (onClick) onClick(targetId);
        if (mode === 'me' || mode === 'friend') {
          history.push({
            pathname: `/f/${targetId}/profile`,
            search: null,
          });
        }
      },
      [onClick, mode, history],
    );

    const handleItemClick = useCallback(
      e => {
        if (e) e.stopPropagation();
        handleMoveItem(itemId);
      },
      [itemId, handleMoveItem],
    );

    const handleRemoveFriend = useCallback(
      async e => {
        e.stopPropagation();
        setVisibleRemoveFriendMessage(false);
        await friendStore.deleteFriend({
          myUserId,
          friendId: itemId,
        });
        if (isActive) handleMoveItem(myUserId);
      },
      [friendStore, myUserId, itemId, isActive, handleMoveItem],
    );

    const handleAddFriend = () => {
      friendStore.addFriend({
        myUserId,
        friendInfo,
      });
    };

    const getRemoveFriendMessageTitle = () => {
      if (fullCompanyJob) {
        return `${displayName}(${fullCompanyJob}) \\n 님을 프렌즈 목록에서 삭제하시겠습니까?`;
      }
      return `${displayName} 님을 프렌즈 목록에서 \\n 삭제하시겠습니까?`;
    };

    const handleRemoveFriendMessageOpen = useCallback(({ domEvent: e }) => {
      if (e) e.stopPropagation();
      setDropdownVisible(false);
      setVisibleRemoveFriendMessage(true);
    }, []);

    const handleRemoveFriendMessageClose = useCallback(e => {
      if (e) e.stopPropagation();
      setVisibleRemoveFriendMessage(false);
    }, []);

    return (
      <Wrapper>
        <FriendItemWrapper
          style={style}
          onClick={handleItemClick}
          isActive={isActive}
          isDndHover={isDndHover}
          mode={mode}
          className=""
        >
          <ProfileWrapper>
            <Profile
              mode={mode}
              tooltipPopupContainer={tooltipPopupContainer}
              profilePhoto={userStore.getProfilePhotoURL(itemId, 'small')}
              itemId={itemId}
              handleClickPhoto={handleSelectPhoto}
            />
          </ProfileWrapper>
          <TextWrapper>
            <TextComponent
              displayName={displayName}
              fullCompanyJob={fullCompanyJob}
              mode={mode}
              orgName={orgName}
              position={position}
            />
          </TextWrapper>
          <ActionWrapper>
            {isNewFriend && (
              <NewFriendBadge className="friend-new-icon"> N </NewFriendBadge>
            )}
            <Action
              mode={mode}
              menu={
                <DropdownMenu
                  friendFavorite={friendFavorite}
                  handleCancelBookmark={handleCancelBookmark}
                  handleAddBookmark={handleAddBookmark}
                  handleRemoveFriendMessageOpen={handleRemoveFriendMessageOpen}
                />
              }
              dropdownVisible={dropdownVisible}
              handleDropdownVisible={handleDropdownVisible}
              handleTalkWindowOpen={handleTalkWindowOpen}
              friendRelation={friendStore.checkAlreadyFriend({
                userId: itemId,
              })}
              handleAddFriend={handleAddFriend}
              isMe={isMe}
              itemId={itemId}
            />
            {mode === 'addFriend' && isMe && <span>내 계정</span>}
          </ActionWrapper>
        </FriendItemWrapper>
        <Message
          visible={visibleRemoveFriendMessage}
          title={getRemoveFriendMessageTitle()}
          type="error"
          btns={[
            {
              text: '삭제',
              type: 'solid',
              onClick: handleRemoveFriend,
            },
            {
              text: '취소',
              type: 'outlined',
              onClick: handleRemoveFriendMessageClose,
            },
          ]}
        />
      </Wrapper>
    );
  },
);

export default FriendItem;

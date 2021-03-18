import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  TextWrapper,
  TextComponentBox,
  TextStatus,
  TitleForName,
  ActionWrapper,
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
  }) => {
    const { t } = useTranslation();
    return (
      <Menu>
        {friendFavorite && (
          <Menu.Item onClick={handleCancelBookmark}>
            {t('CM_BOOKMARK_REMOVE')}
          </Menu.Item>
        )}
        {!friendFavorite && (
          <Menu.Item onClick={handleAddBookmark}>{t('CM_BOOKMARK')}</Menu.Item>
        )}
        <Menu.Item onClick={handleRemoveFriendMessageOpen}>
          프렌즈 삭제
        </Menu.Item>
      </Menu>
    );
  },
);

const Profile = React.memo(
  ({ mode, profilePhoto, itemId, handleClickPhoto }) => {
    return (
      <StyledAvatar mode={mode} onClick={e => handleClickPhoto(e, itemId)}>
        <img src={profilePhoto} alt="" />
      </StyledAvatar>
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
  const { t } = useTranslation();
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
    <Tooltip placement="top" title={t('CM_TEMP_MINI_CHAT')} color="#4C535D">
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
      <TextComponentBox>
        {mode === 'me' && (
          <MeWrapper>
            <img src={mySign} alt="me" />
          </MeWrapper>
        )}
        <TitleForName>{fullDisplayName}</TitleForName>
      </TextComponentBox>
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
    const { t } = useTranslation();
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
    const {
      friendStore,
      userStore,
      roomStore,
      componentStore,
    } = useCoreStores();
    const FileDndDialog = componentStore.get('Talk:FileDndDialog');
    const [isDndDialogVisible, setDndDialogVisible] = useState(false);
    const [dndTargetFiles, setDndTargetFiles] = useState([]);

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [
      visibleRemoveFriendMessage,
      setVisibleRemoveFriendMessage,
    ] = useState(false);

    const myUserId = userStore.myProfile.id;
    const itemId = friendId || userId;
    const isMe = itemId === myUserId;
    const isNewFriend = handleCheckNewFriend(friendInfo);

    const findRoomInfo = async () => {
      const { roomInfo } = roomStore.getDMRoom(myUserId, itemId);
      try {
        if (roomInfo && roomInfo.isVisible) return roomInfo;
        if (roomInfo && !roomInfo.isVisible) {
          await roomStore.updateRoomMemberSetting({
            roomId: roomInfo.id,
            myUserId,
            newIsVisible: true,
          });
          return roomInfo;
        }

        await roomStore.createRoom({
          creatorId: myUserId,
          userList: [{ userId: itemId }],
        });
        const newRoomInfo = roomStore.getDMRoom(myUserId, itemId)?.roomInfo;
        return newRoomInfo;
      } catch (e) {
        console.log(`friend dnd error...${e}`);
      }
    };

    const [{ canDrop, isOver }, drop] = useDrop({
      accept: ACCEPT_ITEMS,
      drop: item => {
        if (TALK_ACCEPT_ITEMS.includes(item.type)) {
          const type = /[a-zA-Z]+:([a-zA-Z]+):[a-zA-Z]+/.exec(
            item.type.toLowerCase(),
          );
          switch (type[1]) {
            case 'note':
              talkOnDrop({
                data: item.data,
                type: type[1] ? type[1] : 'unknown',
                target: 'Platform:Friend',
                findRoom: findRoomInfo,
              });
              break;
            case 'drive':
              setDndDialogVisible(true);
              setDndTargetFiles(item.data);
              break;
            default:
              break;
          }
        }
        return {
          source: item.type,
          sourceData: item.data,
          target: 'Platform:Friend',
          findRoom: findRoomInfo,
        };
      },
      collect: monitor => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    });
    const isDndHover = canDrop && isOver;

    const handleCloseDndDialog = () => {
      setDndDialogVisible(false);
    };

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
        setToastText(t('CM_BOOKMARK_03'));
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
        setToastText(t('CM_BOOKMARK_02'));
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
      const fullName = fullCompanyJob
        ? `${displayName}(${fullCompanyJob})`
        : displayName;

      return t('CM_DEL_FRIENDS_01', {
        name: fullName,
      });
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
      <Wrapper ref={drop}>
        <FriendItemWrapper
          style={style}
          onClick={handleItemClick}
          isActive={isActive}
          isDndHover={isDndHover}
          mode={mode}
          className=""
        >
          <Profile
            mode={mode}
            tooltipPopupContainer={tooltipPopupContainer}
            profilePhoto={userStore.getProfilePhotoURL(itemId, 'small')}
            itemId={itemId}
            handleClickPhoto={handleSelectPhoto}
          />
          <TextWrapper>
            <TextComponent
              displayName={displayName}
              fullCompanyJob={fullCompanyJob}
              mode={mode}
              orgName={orgName}
              position={position}
            />
            {/* <TextStatus>상태메세지영역입니다</TextStatus> */}
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
            {mode === 'addFriend' && isMe && <span>{t('CM_MY_ACCOUNT')}</span>}
          </ActionWrapper>
        </FriendItemWrapper>
        <Message
          visible={visibleRemoveFriendMessage}
          title={getRemoveFriendMessageTitle()}
          type="error"
          btns={[
            {
              text: t('CM_DEL'),
              type: 'solid',
              onClick: handleRemoveFriend,
            },
            {
              text: t('CM_CANCEL'),
              type: 'outlined',
              onClick: handleRemoveFriendMessageClose,
            },
          ]}
        />
        <FileDndDialog
          visible={isDndDialogVisible}
          target="Platform:Friend"
          fileList={dndTargetFiles}
          findRoom={findRoomInfo}
          onClose={handleCloseDndDialog}
        />
      </Wrapper>
    );
  },
);

export default FriendItem;

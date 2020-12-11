import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import styled, { css } from 'styled-components';
import { Avatar, Button } from 'antd';
import {
  useCoreStores,
  Dropdown,
  Menu,
  Message,
  Toast,
  usePortalWindow,
} from 'teespace-core';
import PlatformUIStore from '../../stores/PlatformUIStore';
import { useOpenInWindow } from 'use-open-window';
import { ExportOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import ProfileInfoModal from '../profile/ProfileInfoModal';
import { Talk } from 'teespace-talk-app';

import { ViewMoreIcon, ExportIcon } from '../Icons';

const FriendItemWrapper = styled.div`
  /* 조직도 조회, 추천친구 스타일 */
  white-space: nowrap;
  text-overflow: ellipsis;
  ${props =>
    (props.mode === 'addFriend' || props.mode === 'recommended') &&
    css`
      width: calc(100% - 1.5rem + 8px);
      display: flex;
      flex-direction: row;
      background-color: transparent;
      border-bottom: 1px solid #e3e7eb;
      padding: 0.44rem 0.63rem;
      margin-left: 0.75rem;
      margin-right: calc(0.75rem - 8px);

      &:hover {
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      }

      /* icon */
      .ant-btn-circle {
        background: transparent;
        box-shadow: 0;
        border: 0;
        color: #75757f;
        &:hover {
          color: #75757f;
          background-color: #dcddff;
        }
      }
    `}

  /* 내 프로필 아이템과 친구 아이템의 스타일 */
  ${props =>
    (props.mode === 'me' || props.mode === 'friend') &&
    css`
      display: flex;
      flex-direction: row;
      padding: 0.44rem 0.63rem;

      ${props.isActive
        ? css`
            background-color: #eaeafb;
            border-radius: 1.71875rem;
          `
        : ''}

      &:hover {
        background-color: #eaeafb;
        border-radius: 1.71875rem;
      }

      /* icon */
      .ant-btn-circle {
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        box-shadow: 0;
        border: 0;
        color: #75757f;
        &:hover {
          justify-content: center;
          align-items: center;
          width: 1.5rem;
          height: 1.5rem;
          color: #75757f;
          background-color: #dcddff;
        }
      }
    `}
`;

const ProfileWrapper = styled.div`
  align-items: center;
  display: flex;

  /* me badge */
  .ant-badge-count {
    margin-left: -2.125rem;
  }
`;

const TextWrapper = styled.div`
  margin-left: 0.4375rem;
  flex-grow: 1;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TitleForName = styled.p`
  font-weight: 600;
  font-size: 0.81rem !important;
  margin-bottom: 0 !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledWrapper = styled.div`
  position: relative;
`;
const ProfileBadge = styled.span`
  position: absolute;
  top: -0.56rem;
  left: -0.13rem;
  text-align: center;
  background-color: #523dc7;
  min-width: 1.06rem;
  min-height: 0.94rem;
  padding: 0.06rem 0.25rem;
  border-radius: 0.28rem;
  font-weight: 600;
  font-size: 0.56rem;
  color: #fff;
  line-height: 0.81rem;
  z-index: 100;
  &:after {
    display: block;
    content: '';
    top: 100%;
    left: 50%;
    border: 0.15rem solid transparent;
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-top-color: #523dc7;
    margin-left: -0.15rem;
  }
`;

const StyledAvatar = styled(Avatar)`
  ${props => {
    switch (props.mode) {
      case 'me':
        return css`
          width: 2.5rem;
          height: 2.5rem;
        `;
      case 'addFriend':
        return css`
          width: 2rem;
          height: 2rem;
        `;
      case 'friend':
      default:
        return css`
          width: 2.13rem;
          height: 2.13rem;
        `;
    }
  }}
`;

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
  ({ mode, tooltipPopupContainer, profilePhoto, itemId }) => {
    const [infoVisible, setInfoVisible] = useState(false);
    const toggleProfilePopup = useCallback(e => {
      if (e) e.stopPropagation();
      setInfoVisible(v => !v);
    }, []);

    return (
      <>
        {mode === 'me' && (
          <StyledWrapper>
            <ProfileBadge getPopupContainer={tooltipPopupContainer} visible>
              나
            </ProfileBadge>
            <StyledAvatar
              src={`${profilePhoto}`}
              mode="me"
              onClick={toggleProfilePopup}
            />
          </StyledWrapper>
        )}
        {mode !== 'me' && (
          <StyledAvatar
            src={`${profilePhoto}`}
            mode={mode}
            onClick={toggleProfilePopup}
          />
        )}
        {infoVisible && (
          <ProfileInfoModal
            userId={itemId}
            visible={infoVisible}
            onToggle={toggleProfilePopup}
            position={{ left: '17rem' }}
            profilePhoto={`${profilePhoto}`}
          />
        )}
      </>
    );
  },
);

const FriendAction = React.memo(
  ({ mode, menu, handleDropdownVisible, handleTalkWindowOpen }) => {
    const handleStopPropagation = useCallback(e => e.stopPropagation(), []);
    const handleOpenTalk = useCallback(e => {
      e.stopPropagation();
      console.log(handleTalkWindowOpen());
    }, []);
    return (
      <>
        {mode === 'friend' && (
          <>
            <Dropdown
              overlay={menu}
              trigger={['click']}
              onVisibleChange={handleDropdownVisible}
            >
              <Button
                shape="circle"
                icon={<ViewMoreIcon />}
                onClick={handleStopPropagation}
              />
            </Dropdown>
            <Button
              shape="circle"
              icon={<ExportIcon />}
              onClick={handleOpenTalk}
            />
          </>
        )}
      </>
    );
  },
);

const MeAction = React.memo(({ mode, handleTalkWindowOpen }) => {
  const handleOpenTalk = useCallback(() => {
    console.log(handleTalkWindowOpen());
  }, []);
  return (
    <>
      {mode === 'me' && (
        <Button shape="circle" icon={<ExportIcon />} onClick={handleOpenTalk} />
      )}
    </>
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
    isHovering,
    menu,
    handleDropdownVisible,
    handleTalkWindowOpen,
    friendRelation,
    handleAddFriend,
    isMe,
  }) => (
    <>
      {mode !== 'readOnly' && isHovering && (
        <>
          <FriendAction
            mode={mode}
            menu={menu}
            handleDropdownVisible={handleDropdownVisible}
            handleTalkWindowOpen={handleTalkWindowOpen}
          />
          <MeAction mode={mode} handleTalkWindowOpen={handleTalkWindowOpen} />
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
      // friend는 Friend 목록에서 조회한 UserModel을 사용
      // addFriend (organization)은 Org 목록에서 조회한 UserModel을 사용
      // 둘이 fullCompanyJob 규칙이 살짝 다르다.
      switch (mode) {
        case 'friend': // friends LNB
          if (fullCompanyJob) {
            return `${displayName} (${fullCompanyJob
              .split(', ')
              .map(jobTitle => jobTitle.split(' ').join('-'))
              .join(', ')})`;
          }
          return displayName;
        case 'addFriend': // organization
          if (orgName && position) {
            return `${displayName} (${orgName}·${position})`;
          }
          return displayName;
        default:
          return displayName;
      }
    })();
    return <TitleForName>{fullDisplayName}</TitleForName>;
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
    mode = 'friend', // 'me', 'friend', 'readOnly', 'addFriend', 'recommended'
    isActive = false,
    onClick,
    tooltipPopupContainer = () => document.body,
    friendInfo,
    style,
    openToast,
    setToastText,
  }) => {
    const {
      displayName,
      friendFavorite = false,
      friendId = '',
      id: userId = '',
      fullCompanyJob,
      orgName,
      position,
    } = friendInfo;
    const history = useHistory();
    const { authStore, friendStore, userStore, roomStore } = useCoreStores();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [visibleMessage, setVisibleMessage] = useState(false);
    const [
      visibleRemoveFriendMessage,
      setVisibleRemoveFriendMessage,
    ] = useState(false);
    const [visibleToast, setVisibleToast] = useState(false);

    /* merged info of userInfo and friendInfo */
    const itemId = friendId || userId;

    const talkWindowOpen = usePortalWindow();

    const handleTalkWindowOpen = async () => {
      try {
        const myUserId = userStore.myProfile.id;
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
      if (!visible) {
        setIsHovering(false);
      }
      setDropdownVisible(visible);
    }, []);

    const handleMouseEnter = useCallback(() => {
      if (!dropdownVisible) {
        setIsHovering(true);
      }
    }, [dropdownVisible]);

    const handleMouseLeave = useCallback(() => {
      if (!dropdownVisible) {
        setIsHovering(false);
      }
    }, [dropdownVisible]);

    const handleAddBookmark = useCallback(
      async ({ domEvent: e }) => {
        console.log(e);
        e.stopPropagation();
        try {
          await friendStore.setFriendFavorite({
            myUserId: authStore.user.id,
            friendId: itemId,
            isFav: true,
          });
        } catch (error) {
          console.log(error);
        }
        setIsHovering(false);
        setDropdownVisible(false);
        setToastText('즐겨찾기가 설정되었습니다.');
        openToast();
      },
      [friendStore, authStore, itemId, setToastText, openToast],
    );

    const handleCancelBookmark = useCallback(
      async ({ domEvent: e }) => {
        console.log(e);
        e.stopPropagation();
        await friendStore.setFriendFavorite({
          myUserId: authStore.user.id,
          friendId: itemId,
          isFav: false,
        });
        setToastText('즐겨찾기가 해제되었습니다.');
        openToast();

        // component un-mount. below code does not required.
        setIsHovering(false);
        setDropdownVisible(false);
      },
      [friendStore, authStore, itemId, setToastText, openToast],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleRemoveFriend = useCallback(
      e => {
        e.stopPropagation();
        friendStore.deleteFriend({
          myUserId: authStore.user.id,
          friendId: itemId,
        });
        setIsHovering(false);
        setDropdownVisible(false);
        setVisibleRemoveFriendMessage(false);
      },
      [friendStore, authStore, itemId],
    );

    const handleItemClick = useCallback(
      e => {
        if (e) e.stopPropagation();
        if (onClick) {
          onClick(itemId);
        }
        if (mode === 'me' || mode === 'friend') {
          history.push({
            pathname: `/f/${itemId}/profile`,
            search: null,
          });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },
      [itemId, history, mode, onClick],
    );

    const handleRemoveFriendMessageClose = useCallback(() => {
      setVisibleRemoveFriendMessage(false);
    }, []);

    const handleRemoveFriendMessageOpen = useCallback(() => {
      setIsHovering(false);
      setDropdownVisible(false);
      setVisibleRemoveFriendMessage(true);
    }, []);

    const handleAddFriend = useCallback(() => {
      friendStore.addFriend({
        myUserId: authStore.user.id,
        friendInfo,
      });
      setVisibleToast(true);
    }, [friendStore, authStore.user.id, friendInfo]);

    const handleToastClose = useCallback(() => setVisibleToast(false), []);
    const isMe = itemId === authStore.user.id;

    return (
      <FriendItemWrapper
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleItemClick}
        isActive={isActive}
        mode={mode}
      >
        <Toast
          visible={visibleToast}
          timeoutMs={1000}
          onClose={handleToastClose}
        >
          {`${displayName}님이 프렌즈로 추가되었습니다`}
        </Toast>
        <Message
          visible={visibleRemoveFriendMessage}
          title={`${displayName}님을 프렌즈 목록에서 삭제하시겠습니까?`}
          type="error"
          btns={[
            {
              text: '삭제',
              type: 'solid',
              shape: 'round',
              onClick: handleRemoveFriend,
            },
            {
              text: '취소',
              type: 'outlined',
              onClick: handleRemoveFriendMessageClose,
            },
          ]}
        />
        <Message
          visible={visibleMessage}
          title={`${displayName}님을 즐겨찾기에 추가하시겠습니까?`}
          btns={[
            {
              type: 'solid',
              text: '추가',
              handler: () => setVisibleMessage(false),
            },
            {
              type: 'outlined',
              text: '취소',
              handler: () => setVisibleMessage(false),
            },
          ]}
        />
        <ProfileWrapper>
          <Profile
            mode={mode}
            tooltipPopupContainer={tooltipPopupContainer}
            profilePhoto={userStore.getProfilePhotoURL(itemId, 'small')}
            itemId={itemId}
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
          <Action
            mode={mode}
            isHovering={isHovering}
            menu={
              <DropdownMenu
                friendFavorite={friendFavorite}
                handleCancelBookmark={handleCancelBookmark}
                handleAddBookmark={handleAddBookmark}
                handleRemoveFriendMessageOpen={handleRemoveFriendMessageOpen}
              />
            }
            handleDropdownVisible={handleDropdownVisible}
            handleTalkWindowOpen={handleTalkWindowOpen}
            friendRelation={friendStore.checkAlreadyFriend({ userId: itemId })}
            handleAddFriend={handleAddFriend}
            isMe={isMe}
          />
          {mode === 'addFriend' && isMe && <span>내 계정</span>}
        </ActionWrapper>
      </FriendItemWrapper>
    );
  },
);

export default FriendItem;

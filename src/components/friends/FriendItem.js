import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css, createGlobalStyle } from 'styled-components';
import { Tooltip, Typography, Avatar, Button } from 'antd';
import { useCoreStores, Dropdown, Menu, Message, Toast } from 'teespace-core';
import { useOpenInWindow } from 'use-open-window';
import {
  EllipsisOutlined,
  ExportOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const GlobalStyle = createGlobalStyle`
  .teespace-common {
    &.teespace-me-tooltip {
      left: 0.625rem !important;
      top: 0.2rem !important;
      transform-origin: 50% 0.5371rem !important;
      margin-top: -0.5rem;

      .ant-tooltip-arrow {
          top: 1.26rem;
          .ant-tooltip-arrow-content {
              transform: translateY(-6.53553391px) rotate(45deg);
          }
      }
      .ant-tooltip-inner {
          font-size: 0.56rem;
          padding: 0.05rem 0.25rem;
          background-color: #523dc7;
          border-radius: 0.28rem;
          min-width: 0;
          min-height: 0;
      }
    }
  }
`;
const FriendItemWrapper = styled.div`
  /* 조직도 조회, 추천친구 스타일 */
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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

const TitleForName = styled(Title)`
  font-size: 0.8125rem !important;
  margin-bottom: 0 !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
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
const Profile = React.memo(({ mode, tooltipPopupContainer, profilePhoto }) => {
  return (
    <>
      {mode === 'me' && (
        <Tooltip
          overlayClassName="teespace-common teespace-me-tooltip"
          title="나"
          getPopupContainer={tooltipPopupContainer}
          placement="top"
          visible
        >
          <StyledAvatar src={`/${profilePhoto}`} mode="me" />
        </Tooltip>
      )}
      {mode !== 'me' && <StyledAvatar src={`/${profilePhoto}`} mode={mode} />}
    </>
  );
});

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
                icon={<EllipsisOutlined />}
                onClick={handleStopPropagation}
              />
            </Dropdown>
            <Button
              shape="circle"
              icon={<ExportOutlined />}
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
        <Button
          shape="circle"
          icon={<ExportOutlined />}
          onClick={handleOpenTalk}
        />
      )}
    </>
  );
});

const AddFriendAction = React.memo(
  ({ mode, alreadyFriendFlag, handleAddFriend }) => (
    <>
      {mode === 'addFriend' && !alreadyFriendFlag && (
        <Button
          shape="circle"
          icon={<PlusOutlined onClick={handleAddFriend} />}
        />
      )}
    </>
  ),
);

const RecommendedAction = React.memo(
  ({ mode, alreadyFriendFlag, handleAddFriend }) => (
    <>
      {mode === 'recommended' && !alreadyFriendFlag && (
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
    alreadyFriendFlag,
    handleAddFriend,
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
            alreadyFriendFlag={alreadyFriendFlag}
            handleAddFriend={handleAddFriend}
          />
          <RecommendedAction
            mode={mode}
            alreadyFriendFlag={alreadyFriendFlag}
            handleAddFriend={handleAddFriend}
          />
        </>
      )}
    </>
  ),
);
const TextComponent = React.memo(({ displayName }) => (
  <TitleForName>{displayName}</TitleForName>
));
/**
 * A friend item component to use in the list view.
 * @param {Object} props
 * @param {('me'|'friend'|'readOnly'|'addFriend'|'recommended')} props.mode
 * @param {function} props.tooltipPopupContainer
 * @param {object} props.friendInfo
 * @param {string} props.friendInfo.friendId
 * @param {string} props.friendInfo.friendNick
 * @param {string} props.friendInfo.userName
 * @param {boolean} props.friendInfo.friendFavorite
 */
const FriendItem = React.memo(
  ({
    mode = 'friend', // 'me', 'friend', 'readOnly', 'addFriend', 'recommended'
    isActive = false,
    onClick,
    tooltipPopupContainer = () => document.body,
    friendInfo,
    style,
  }) => {
    const {
      displayName,
      friendFavorite = false,
      friendId = '',
      id: userId = '',
      profilePhoto = '',
      defaultPhotoUrl,
    } = friendInfo;
    const history = useHistory();
    const { authStore, friendStore } = useCoreStores();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [visibleMessage, setVisibleMessage] = useState(false);
    const [visibleToast, setVisibleToast] = useState(false);
    const [
      visibleRemoveFriendMessage,
      setVisibleRemoveFriendMessage,
    ] = useState(false);

    /* merged info of userInfo and friendInfo */
    const itemId = friendId || userId;

    const [alreadyFriendFlag, setAlreadyFriendFlag] = useState(
      friendStore.checkAlreadyFriend({ userId: friendId }),
    );

    const [handleTalkWindowOpen, newTalkWindowHandler] = useOpenInWindow(
      `${window.location.origin}/s/1234/talk?mini=true`,
      {
        name: '_blank',
        centered: true,
        specs: {
          width: 600,
          height: 900,
        },
      },
    );

    useEffect(() => {
      if (mode === 'addFriend') {
        setAlreadyFriendFlag(
          friendStore.checkAlreadyFriend({ userId: itemId }),
        );
      }
    }, [itemId, friendStore.friendInfoList, mode, friendStore]);

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
      },
      [friendStore, authStore, itemId],
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
        // component un-mount. below code does not required.
        // setIsHovering(false);
        // setDropdownVisible(false);
      },
      [friendStore, authStore, itemId],
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

    const handleItemClick = useCallback(() => {
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
    }, [itemId, history, mode, onClick]);

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

    return (
      <FriendItemWrapper
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleItemClick}
        isActive={isActive}
        mode={mode}
      >
        <GlobalStyle />
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
          btns={[
            { text: '삭제', type: 'solid', onClick: handleRemoveFriend },
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
            profilePhoto={profilePhoto || defaultPhotoUrl}
          />
        </ProfileWrapper>
        <TextWrapper>
          <TextComponent displayName={displayName} />
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
            alreadyFriendFlag={alreadyFriendFlag}
            handleAddFriend={handleAddFriend}
          />
        </ActionWrapper>
      </FriendItemWrapper>
    );
  },
);

export default FriendItem;

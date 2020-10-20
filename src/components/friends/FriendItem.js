import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
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

const FriendItemWrapper = styled.div`
  /* 조직도 조회, 추천친구 스타일 */
  ${props =>
    (props.mode === 'addFriend' || props.mode === 'recommended') &&
    css`
      display: flex;
      height: 54px;
      flex-direction: row;
      background-color: transparent;
      border-bottom: 1px solid #e3e7eb;
      padding: 10px;

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
      height: 54px;
      display: flex;
      flex-direction: row;
      padding: 10px;

      ${props.isActive
        ? css`
            background-color: #eaeafb;
            border-radius: 27.5px;
          `
        : ''}

      &:hover {
        background-color: #eaeafb;
        border-radius: 27.5px;
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
  /* me badge */
  .ant-badge-count {
    margin-left: -34px;
  }
`;

const TextWrapper = styled.div`
  margin-left: 7px;
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const TitleForName = styled(Title)`
  font-size: 13px !important;
  margin-bottom: 0 !important;
`;

const ActionWrapper = styled.div``;

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
  ({ mode, imageSize, tooltipPopupContainer, profilePhoto }) => {
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
            <Avatar size={imageSize} src={`/${profilePhoto}`} />
          </Tooltip>
        )}
        {mode !== 'me' && <Avatar size={imageSize} src={`/${profilePhoto}`} />}
      </>
    );
  },
);

const FriendAction = React.memo(
  ({ mode, menu, handleDropdownVisible, handleTalkWindowOpen }) => (
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
              onClick={e => e.stopPropagation()}
            />
          </Dropdown>
          <Button
            shape="circle"
            icon={<ExportOutlined />}
            onClick={e => {
              e.stopPropagation();
              console.log(handleTalkWindowOpen());
            }}
          />
        </>
      )}
    </>
  ),
);

const MeAction = React.memo(({ mode, handleTalkWindowOpen }) => (
  <>
    {mode === 'me' && (
      <Button
        shape="circle"
        icon={<ExportOutlined />}
        onClick={() => console.log(handleTalkWindowOpen())}
      />
    )}
  </>
));

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
/**
 * A friend item component to use in the list view.
 * @param {Object} props
 * @param {('me'|'friend'|'readOnly'|'addFriend'|'recommended')} props.mode
 * @param {function} props.tooltipPopupContainer
 * @param {number} props.imageSize
 * @param {object} props.friendInfo
 * @param {string} props.friendInfo.friendId
 * @param {string} props.friendInfo.friendNick
 * @param {string} props.friendInfo.userName
 * @param {boolean} props.friendInfo.friendFavorite
 */
const FriendItem = React.memo(
  ({
    mode = 'friend', // 'me', 'friend', 'readOnly', 'addFriend', 'recommended'
    imageSize = 34,
    isActive = false,
    onClick,
    tooltipPopupContainer = () => document.body,
    friendInfo,
  }) => {
    const {
      displayName,
      friendFavorite = false,
      friendId = '',
      id: userId = '',
      profilePhoto = '',
      defaultPhotoUrl,
    } = friendInfo;
    console.log('displayName', displayName, defaultPhotoUrl);
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
      !!friendStore.friendInfoList
        .map(__friendInfo => __friendInfo.friendId)
        .includes(friendId),
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
          !!friendStore.friendInfoList
            .map(__friendInfo => __friendInfo.friendId)
            .includes(itemId),
        );
      }
    }, [itemId, friendStore.friendInfoList, mode]);

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
      ({ domEvent: e }) => {
        console.log(e);
        e.stopPropagation();
        friendStore.setFriendFavorite(authStore.user.id, itemId, true);
        setIsHovering(false);
        setDropdownVisible(false);
      },
      [friendStore, authStore, itemId],
    );

    const handleCancelBookmark = useCallback(
      ({ domEvent: e }) => {
        console.log(e);
        e.stopPropagation();
        friendStore.setFriendFavorite(authStore.user.id, itemId, false);
        setIsHovering(false);
        setDropdownVisible(false);
      },
      [friendStore, authStore, itemId],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleRemoveFriend = useCallback(
      e => {
        e.stopPropagation();
        friendStore.deleteFriendInfo(authStore.user.id, itemId);
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
      friendStore.addFriendInfo(authStore.user.id, itemId);
      friendStore.addFriendInfoToFriendInfoList(friendInfo);
      setVisibleToast(true);
    }, [friendStore, authStore.user.id, itemId, friendInfo]);

    const handleToastClose = useCallback(() => setVisibleToast(false), []);

    return (
      <FriendItemWrapper
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
            imageSize={imageSize}
            tooltipPopupContainer={tooltipPopupContainer}
            profilePhoto={profilePhoto || defaultPhotoUrl}
          />
        </ProfileWrapper>
        <TextWrapper>
          <TitleForName>{displayName}</TitleForName>
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

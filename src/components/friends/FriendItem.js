import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Tooltip, Typography, Avatar, Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useOpenInWindow } from 'use-open-window';
import {
  EllipsisOutlined,
  ExportOutlined,
  UserOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import CommonDropdown, { CommonMenu } from '../commons/Dropdown';
import CommonMessage from '../commons/Message';
import CommonToast from '../commons/Toast';

const { Title } = Typography;

const FriendItemWrapper = styled.div`
  /* 조직도 조회 스타일 */
  ${props =>
    props.mode === 'addFriend' &&
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

  /* 내 프로필은 항상 active style */
  ${props =>
    props.mode === 'me' &&
    css`
      background-color: #e2e3fb;
      border-radius: 27.5px;
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
    <CommonMenu>
      {friendFavorite && (
        <CommonMenu.Item onClick={handleCancelBookmark}>
          즐겨찾기 해제
        </CommonMenu.Item>
      )}
      {!friendFavorite && (
        <CommonMenu.Item onClick={handleAddBookmark}>즐겨찾기</CommonMenu.Item>
      )}
      <CommonMenu.Item onClick={handleRemoveFriendMessageOpen}>
        프렌즈 삭제
      </CommonMenu.Item>
    </CommonMenu>
  ),
);
const Profile = React.memo(
  ({ mode, imageSize, tooltipPopupContainer, thumbPhoto, friendId }) => {
    const { userStore } = useCoreStores();
    const profileSrc =
      thumbPhoto ||
      `/${userStore.getUserDefaultPhotoUrl({ userId: friendId })}`;
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
            <Avatar size={imageSize} src={profileSrc} />
          </Tooltip>
        )}
        {mode !== 'me' && <Avatar size={imageSize} src={profileSrc} />}
      </>
    );
  },
);

const FriendAction = React.memo(
  ({ mode, menu, handleDropdownVisible, handleTalkWindowOpen }) => (
    <>
      {mode === 'friend' && (
        <>
          <CommonDropdown
            overlay={menu}
            trigger={['click']}
            onVisibleChange={handleDropdownVisible}
          >
            <Button
              shape="circle"
              icon={<EllipsisOutlined />}
              onClick={e => e.stopPropagation()}
            />
          </CommonDropdown>
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

const RecommendedAction = React.memo(({ mode, alreadyFriendFlag }) => (
  <>
    {mode === 'recommended' && !alreadyFriendFlag && (
      <>
        <Button shape="circle" icon={<PlusOutlined />} />
        <Button shape="circle" icon={<CloseOutlined />} />
      </>
    )}
  </>
));

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
function FriendItem({
  mode = 'friend', // 'me', 'friend', 'readOnly', 'addFriend', 'recommended'
  imageSize = 34,
  tooltipPopupContainer = () => document.body,
  friendInfo: {
    friendNick = '',
    userName = '',
    friendFavorite = false,
    friendId,
    thumbPhoto = '',
  },
}) {
  const history = useHistory();
  const { authStore, friendStore } = useCoreStores();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [visibleMessage, setVisibleMessage] = useState(false);
  const [visibleToast, setVisibleToast] = useState(false);
  const [visibleRemoveFriendMessage, setVisibleRemoveFriendMessage] = useState(
    false,
  );

  const [alreadyFriendFlag, setAlreadyFriendFlag] = useState(
    !!friendStore.friendInfoList
      .map(friendInfo => friendInfo.friendId)
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
      console.log(
        'alreadyFriend',
        !!friendStore.friendInfoList
          .map(friendInfo => friendInfo.friendId)
          .includes(friendId),
      );
      setAlreadyFriendFlag(
        !!friendStore.friendInfoList
          .map(friendInfo => friendInfo.friendId)
          .includes(friendId),
      );
    }
  }, [friendId, friendStore.friendInfoList, mode]);

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

  const handleAddBookmark = useCallback(() => {
    friendStore.setFriendFavorite(authStore.user.id, friendId, true);
    setIsHovering(false);
    setDropdownVisible(false);
  }, [friendStore, authStore, friendId]);

  const handleCancelBookmark = useCallback(() => {
    friendStore.setFriendFavorite(authStore.user.id, friendId, false);
    setIsHovering(false);
    setDropdownVisible(false);
  }, [friendStore, authStore, friendId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRemoveFriend = useCallback(() => {
    friendStore.deleteFriendInfo(authStore.user.id, friendId);
    setIsHovering(false);
    setDropdownVisible(false);
    setVisibleRemoveFriendMessage(false);
  }, [friendStore, authStore, friendId]);

  const handleItemClick = useCallback(() => {
    if (mode === 'me' || mode === 'friend') {
      history.push({
        pathname: `/f/${
          mode === 'me' ? authStore.myInfo.id : friendId
        }/profile`,
        search: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendId]);

  const handleRemoveFriendMessageClose = useCallback(() => {
    setVisibleRemoveFriendMessage(false);
  }, []);

  const handleRemoveFriendMessageOpen = useCallback(() => {
    setIsHovering(false);
    setDropdownVisible(false);
    setVisibleRemoveFriendMessage(true);
  }, []);

  const handleAddFriend = useCallback(() => {
    friendStore.addFriendInfo(authStore.user.id, friendId);
    setVisibleToast(true);
  }, [authStore.user.id, friendId, friendStore]);

  const handleToastClose = useCallback(() => setVisibleToast(false), []);

  console.log(tooltipPopupContainer);

  return (
    <FriendItemWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleItemClick}
      mode={mode}
    >
      <CommonToast
        visible={visibleToast}
        timeoutMs={1000}
        onClose={handleToastClose}
      >
        {`${userName || friendNick}님이 프렌즈로 추가되었습니다`}
      </CommonToast>
      <CommonMessage
        visible={visibleRemoveFriendMessage}
        title={`${
          userName || friendNick
        }님을 프렌즈 목록에서 삭제하시겠습니까?`}
        btns={[
          { text: '삭제', type: 'solid', onClick: handleRemoveFriend },
          {
            text: '취소',
            type: 'outlined',
            onClick: handleRemoveFriendMessageClose,
          },
        ]}
      />
      <CommonMessage
        visible={visibleMessage}
        title={`${friendNick || userName}님을 즐겨찾기에 추가하시겠습니까?`}
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
          thumbPhoto={thumbPhoto}
          friendId={friendId}
        />
      </ProfileWrapper>
      <TextWrapper>
        <TitleForName>{friendNick || userName}</TitleForName>
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
}

export default FriendItem;

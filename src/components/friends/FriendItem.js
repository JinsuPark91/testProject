import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Badge, Dropdown, Typography, Menu, Space, Avatar, Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useOpenInWindow } from 'use-open-window';
import {
  EllipsisOutlined,
  ExportOutlined,
  UserOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import CommonMessage from '../commons/Message';

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

/**
 * A friend item component to use in the list view.
 * @param {Object} props
 * @param {('me'|'friend'|'readOnly'|'addFriend'|'recommended')} props.mode
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
  friendInfo: {
    friendNick = '',
    userName = '',
    friendFavorite = false,
    friendId,
  },
}) {
  const history = useHistory();
  const { authStore, friendStore } = useCoreStores();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [visibleMessage, setVisibleMessage] = useState(false);
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
  }, [friendStore, authStore, friendId]);

  const handleItemClick = useCallback(() => {
    history.push({
      pathname: `/f/${mode === 'me' ? authStore.myInfo.id : friendId}/profile`,
      search: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [friendId]);

  const menu = (
    <Menu>
      {friendFavorite && (
        <Menu.Item onClick={handleCancelBookmark}>즐겨찾기 해제</Menu.Item>
      )}
      {!friendFavorite && (
        <Menu.Item onClick={handleAddBookmark}>즐겨찾기</Menu.Item>
      )}
      <Menu.Item onClick={handleRemoveFriend}>프렌즈 삭제</Menu.Item>
    </Menu>
  );

  return (
    <FriendItemWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleItemClick}
      mode={mode}
    >
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
        {mode === 'me' && (
          <Badge count="나">
            <Avatar icon={<UserOutlined />} size={imageSize} />
          </Badge>
        )}
        {mode !== 'me' && <Avatar icon={<UserOutlined />} size={imageSize} />}
      </ProfileWrapper>
      <TextWrapper>
        <TitleForName>{friendNick || userName}</TitleForName>
      </TextWrapper>
      <ActionWrapper>
        {mode !== 'readOnly' && isHovering && (
          <>
            {mode === 'friend' && (
              <>
                <Dropdown
                  overlay={menu}
                  trigger={['click']}
                  onVisibleChange={handleDropdownVisible}
                >
                  <Button shape="circle" icon={<EllipsisOutlined />} />
                </Dropdown>
                <Button
                  shape="circle"
                  icon={<ExportOutlined />}
                  onClick={() => console.log(handleTalkWindowOpen())}
                />
              </>
            )}
            {mode === 'me' && (
              <Button
                shape="circle"
                icon={<ExportOutlined />}
                onClick={() => console.log(handleTalkWindowOpen())}
              />
            )}
            {mode === 'addFriend' && (
              <Button shape="circle" icon={<PlusOutlined />} />
            )}
            {mode === 'recommended' && (
              <>
                <Button shape="circle" icon={<PlusOutlined />} />
                <Button shape="circle" icon={<CloseOutlined />} />
              </>
            )}
          </>
        )}
      </ActionWrapper>
    </FriendItemWrapper>
  );
}

export default FriendItem;

import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Badge, Dropdown, Typography, Menu, Space, Avatar, Button } from 'antd';
import { useCoreStores } from 'teespace-core';
import {
  EllipsisOutlined,
  ExportOutlined,
  UserOutlined,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const FriendItemWrapper = styled.div`
  height: 54px;
  display: flex;
  flex-direction: row;
  padding: 10px;

  &:hover {
    background-color: #eaeafb;
    border-radius: 27.5px;
  }
  ${props =>
    props.mode === 'me' &&
    css`
      background-color: #e2e3fb;
      border-radius: 27.5px;
    `}

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
 * @param {('FAV0001'|'FAV0002')} props.friendInfo.friendFav
 */
function FriendItem({
  mode = 'friend', // 'me', 'friend', 'readOnly', 'addFriend', 'recommended'
  imageSize = 34,
  friendInfo: {
    friendNick = '',
    userName = '',
    friendFav = 'FAV0002',
    friendId,
  },
}) {
  const { authStore, friendStore } = useCoreStores();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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
    friendStore.updateFriendInfo({
      userId: authStore.user.userId,
      friendId,
      editedInfo: { friendFav: 'FAV0001' },
    });
    setIsHovering(false);
    setDropdownVisible(false);
  }, [friendStore, authStore, friendId]);

  const handleCancelBookmark = useCallback(() => {
    friendStore.updateFriendInfo({
      userId: authStore.user.userId,
      friendId,
      editedInfo: { friendFav: 'FAV0002' },
    });
    setIsHovering(false);
    setDropdownVisible(false);
  }, [friendStore, authStore, friendId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRemoveFriend = useCallback(() => {});
  const menu = (
    <Menu>
      {friendFav === 'FAV0001' && (
        <Menu.Item onClick={handleCancelBookmark}>즐겨찾기 해제</Menu.Item>
      )}
      {friendFav === 'FAV0002' && (
        <Menu.Item onClick={handleAddBookmark}>즐겨찾기</Menu.Item>
      )}
      <Menu.Item onClick={handleRemoveFriend}>프렌즈 삭제</Menu.Item>
    </Menu>
  );

  return (
    <FriendItemWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      mode={mode}
    >
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
                <Button shape="circle" icon={<ExportOutlined />} />
              </>
            )}
            {mode === 'me' && (
              <Button shape="circle" icon={<ExportOutlined />} />
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

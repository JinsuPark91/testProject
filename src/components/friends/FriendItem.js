import React, { useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { talkOnDrop } from 'teespace-talk-app';
import { useDrop } from 'react-dnd';
import { observer } from 'mobx-react';
import {
  useCoreStores,
  Dropdown,
  Menu,
  Message,
  Tooltip,
  Icons,
} from 'teespace-core';
import { ThemeContext } from 'styled-components';
import { rootStore } from '../../stores';
import { ACCEPT_ITEMS, TALK_ACCEPT_ITEMS } from '../../utils/DndConstant';
import { handleCheckNewFriend } from '../../utils/FriendsUtil';
import { handleProfileMenuClick } from '../../utils/ProfileUtil';
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
  StatusIconWrapper,
} from '../../styles/friends/FriendItemStyle';
import { ViewMoreIcon, ExportIcon } from '../Icons';

const { uiStore } = rootStore;

const disableScroll = event => event.preventDefault();

const ProfilePhoto = React.memo(
  ({ profilePhoto, itemId, handleClickPhoto }) => {
    return (
      <StyledAvatar
        className="friends__item__photo"
        onClick={e => handleClickPhoto(e, itemId)}
      >
        <img src={profilePhoto} alt="" />
      </StyledAvatar>
    );
  },
);

const TextComponent = React.memo(({ displayName, fullCompanyJob, mode }) => {
  const fullDisplayName = (() => {
    switch (mode) {
      case 'me':
      case 'friend': {
        const fullCompanyJobTxt = fullCompanyJob ? `(${fullCompanyJob})` : '';
        return `${displayName} ${fullCompanyJobTxt}`;
      }
      default:
        return displayName;
    }
  })();

  return (
    <TextComponentBox>
      {mode === 'me' && <MeWrapper>나</MeWrapper>}
      <TitleForName>{fullDisplayName}</TitleForName>
    </TextComponentBox>
  );
});

const DropdownMenu = React.memo(
  ({
    friendFavorite,
    handleCancelBookmark,
    handleAddBookmark,
    handleRemoveFriendMessageOpen,
  }) => {
    const { t } = useTranslation();
    const handleClickContextMenu = () => {
      document
        .getElementById('lnb__friend-container')
        .removeEventListener('wheel', disableScroll);
    };

    // 추후 프렌즈 삭제 i18n 교체 필요
    return (
      <Menu onClick={handleClickContextMenu}>
        {friendFavorite && (
          <Menu.Item onClick={handleCancelBookmark}>
            {t('CM_BOOKMARK_REMOVE')}
          </Menu.Item>
        )}
        {!friendFavorite && (
          <Menu.Item onClick={handleAddBookmark}>{t('CM_BOOKMARK')}</Menu.Item>
        )}
        <Menu.Item onClick={handleRemoveFriendMessageOpen}>
          {t('TEMP_DELETE_FRIEND')}
        </Menu.Item>
      </Menu>
    );
  },
);

const OpenMiniTalk = roomInfo => {
  uiStore.openWindow({
    id: roomInfo.id,
    type: 'talk',
    name: roomInfo.name,
    userCount: roomInfo.userCount,
    handler: null,
  });
};

const FriendAction = React.memo(
  ({ mode, menu, dropdownVisible, handleDropdownVisible }) => {
    return (
      <>
        {mode === 'friend' && (
          <>
            <Dropdown
              overlay={menu}
              trigger={['click']}
              onClick={e => {
                e.stopPropagation();
                document
                  .getElementById('lnb__friend-container')
                  .addEventListener('wheel', disableScroll);
              }}
              visible={dropdownVisible}
              onVisibleChange={handleDropdownVisible}
            >
              <MoreIconWrapper className="lnb-friend__more-icon friends__item__config-button">
                <ViewMoreIcon />
              </MoreIconWrapper>
            </Dropdown>
          </>
        )}
      </>
    );
  },
);

const AllAction = React.memo(({ itemId }) => {
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
    );
  };

  const themeContext = useContext(ThemeContext);

  return (
    <Tooltip
      placement="top"
      title={t('CM_TEMP_MINI_CHAT')}
      color={themeContext.CoreLight}
    >
      <MoreIconWrapper
        className="lnb-friend__export-icon friends__item__export-button"
        onClick={handleExport}
      >
        <ExportIcon color="#7B7671" />
      </MoreIconWrapper>
    </Tooltip>
  );
});

const Action = React.memo(
  ({ mode, menu, dropdownVisible, handleDropdownVisible, itemId }) => (
    <>
      <FriendAction
        mode={mode}
        menu={menu}
        dropdownVisible={dropdownVisible}
        handleDropdownVisible={handleDropdownVisible}
      />
      <AllAction itemId={itemId} />
    </>
  ),
);

/**
 * A friend item component to use in the list view.
 * @param {Object} props
 * @param {('me'|'friend')} props.mode
 * @param {function} props.tooltipPopupContainer
 * @param {UserModel} props.friendInfo
 */
const FriendItem = observer(
  ({
    mode = 'friend', // 'me', 'friend'
    isActive = false,
    onClick,
    friendInfo,
    handleOpenInfoModal,
    handleOpenToast,
  }) => {
    const { t } = useTranslation();
    const {
      displayName,
      friendFavorite = false,
      friendId = '',
      id: userId = '',
      profileStatusMsg,
    } = friendInfo;
    const fullCompanyJob = friendInfo.getFullCompanyJob(1);
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

    const themeContext = useContext(ThemeContext);

    const {
      ProfileEmotionNormalIcon,
      ProfileEmotionMissedIcon,
      ProfileEmotionVacationIcon,
      ProfileEmotionMeetingIcon,
    } = Icons;

    const userStatus = friendInfo.status;

    const renderStatusIcon = code => {
      if (code === 'STA0001')
        return <ProfileEmotionNormalIcon width={0.875} height={0.875} />;

      if (code === 'STA0002')
        return <ProfileEmotionMissedIcon width={0.875} height={0.875} />;

      if (code === 'STA0003')
        return <ProfileEmotionVacationIcon width={0.875} height={0.875} />;

      if (code === 'STA0004')
        return <ProfileEmotionMeetingIcon width={0.875} height={0.875} />;

      return null;
    };

    const getStatusI18nKey = key => {
      switch (key) {
        case 'STA0001':
          return 'CM_STATUS_ONLINE';
        case 'STA0002':
          return 'CM_STATUS_MISSED';
        case 'STA0003':
          return 'CM_STATUS_VACATION';
        case 'STA0004':
          return 'CM_STATUS_MEETING';
        default:
          return '';
      }
    };

    const myUserId = userStore.myProfile.id;
    const itemId = friendId || userId;
    const isNewFriend = handleCheckNewFriend(friendInfo);

    const findRoomInfo = async () => {
      const { roomInfo } = roomStore.getDMRoom(myUserId, itemId);
      try {
        if (roomInfo && roomInfo.isVisible) return roomInfo;
        if (roomInfo && !roomInfo.isVisible) {
          await roomStore.activateRoom({ roomId: roomInfo.id });
          return roomInfo;
        }

        await roomStore.createRoom({
          creatorId: myUserId,
          userList: [{ userId: itemId }],
          language: userStore.myProfile.language,
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

    const handleSelectPhoto = (e, id = '') => {
      if (e) e.stopPropagation();
      if (id) handleOpenInfoModal(id);
    };

    const handleDropdownVisible = useCallback(visible => {
      setDropdownVisible(visible);
      if (!visible)
        document
          .getElementById('lnb__friend-container')
          .removeEventListener('wheel', disableScroll);
    }, []);

    const handleAddBookmark = async ({ domEvent: e }) => {
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
      handleOpenToast(t('CM_BOOKMARK_03'));
    };

    const handleCancelBookmark = async ({ domEvent: e }) => {
      e.stopPropagation();
      await friendStore.setFriendFavorite({
        myUserId,
        friendId: itemId,
        isFav: false,
      });
      handleOpenToast(t('CM_BOOKMARK_02'));
    };

    const handleMoveItem = targetId => {
      if (onClick) onClick(targetId);
      history.push({
        pathname: `/f/${targetId}/profile`,
        search: null,
      });
    };

    const handleItemClick = e => {
      if (e) e.stopPropagation();
      handleMoveItem(itemId);
    };

    const handleRemoveFriend = async e => {
      e.stopPropagation();
      setVisibleRemoveFriendMessage(false);
      await friendStore.deleteFriend({
        myUserId,
        friendId: itemId,
      });
      if (isActive) handleMoveItem(myUserId);
    };

    const getRemoveFriendMessageTitle = () => {
      const fullCompanyJobTxt = fullCompanyJob ? `(${fullCompanyJob})` : '';
      const fullName = `${displayName} ${fullCompanyJobTxt}`;

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
          onClick={handleItemClick}
          isActive={isActive}
          isDndHover={isDndHover}
          mode={mode}
          className="friends__item"
        >
          <ProfilePhoto
            profilePhoto={userStore.getProfilePhotoURL(itemId, 'small')}
            itemId={itemId}
            handleClickPhoto={handleSelectPhoto}
          />
          <Tooltip
            title={t(getStatusI18nKey(userStatus))}
            placement="bottom"
            color={themeContext.CoreLight}
          >
            <StatusIconWrapper>
              {renderStatusIcon(userStatus)}
            </StatusIconWrapper>
          </Tooltip>
          <TextWrapper>
            <TextComponent
              displayName={displayName}
              fullCompanyJob={fullCompanyJob}
              mode={mode}
            />
            {profileStatusMsg && <TextStatus>{profileStatusMsg}</TextStatus>}
          </TextWrapper>
          <ActionWrapper>
            {isNewFriend && (
              <NewFriendBadge className="lnb-friend__new-icon">
                {' '}
                N{' '}
              </NewFriendBadge>
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
              itemId={itemId}
            />
          </ActionWrapper>
        </FriendItemWrapper>
        {visibleRemoveFriendMessage && (
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
        )}
        {isDndDialogVisible && (
          <FileDndDialog
            visible={isDndDialogVisible}
            target="Platform:Friend"
            fileList={dndTargetFiles}
            findRoom={findRoomInfo}
            onClose={() => setDndDialogVisible(false)}
          />
        )}
      </Wrapper>
    );
  },
);

export default FriendItem;

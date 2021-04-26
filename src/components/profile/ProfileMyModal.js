import React, { useEffect, useState, useCallback } from 'react';
import { Button, Dropdown, Menu, Checkbox, Tooltip } from 'antd';
import {
  useCoreStores,
  Toast,
  Message,
  ProfileInfoModal,
  ProfileModal,
  logEvent,
  AddFriendsByInvitationDialog,
  AddFriendsBySearch,
  SettingDialog,
} from 'teespace-core';
import { useHistory } from 'react-router-dom';
import { useObserver, Observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { fallbackLanguage } from '../../i18n';
import ProfileSpaceModal from './ProfileSpaceModal';
import SelectRoomTypeDialog from '../Rooms/SelectRoomTypeDialog';
import SpaceEditModal from './SpaceEditModal';
import MovePage from '../../utils/MovePage';
import { getMainWaplURL } from '../../utils/UrlUtil';
import { isSpaceAdmin } from '../../utils/GeneralUtil';
import { ArrowRightIcon } from '../Icons';
import {
  UserImage,
  UserName,
  UserMail,
  UserStatus,
  UserButtonBox,
  UserBar,
  LogoutButton,
  UserSpaceArea,
  DataName,
  DataBox,
  NewBadge,
  Logo,
  Info,
  Title,
  Blind,
  UserSubArea,
  LanguageButton,
  ConvertDropdown,
  ConvertNow,
  LogoSmall,
  LogoNumber,
  NowInfo,
  NowTitle,
  ConvertList,
  ConvertItem,
  ItemText,
  ConvertBox,
  ConvertAdd,
  AddBox,
  AddText,
  ConvertMove,
  UserSettingArea,
  SettingButton,
  SettingBar,
} from '../../styles/profile/ProfileMyModalStyle';
import { ReactComponent as SquareSpaceIcon } from '../../assets/card_view.svg';
import LanguageIcon from '../../assets/language.svg';

const ProfileMyModal = ({
  userId,
  onCancel,
  thumbPhoto,
  visible = false,
  created = false,
}) => {
  const { t, i18n } = useTranslation();
  const { userStore, spaceStore, configStore } = useCoreStores();
  const history = useHistory();
  const profile = userStore.myProfile;
  const { isGuest } = userStore.myProfile;

  const [isCreated, setIsCreated] = useState(created);
  const [settingDialogVisible, setSettingDialogVisible] = useState(false);
  const [spaceListVisible, setSpaceListVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isFriendMemViewOpen, setIsFriendMemViewOpen] = useState(false);

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isViewMode, setIsViewMode] = useState(true);

  const [isRoomDialogVisible, setIsRoomDialogVisible] = useState(false);
  const [isSpaceEditDialogVisible, setIsSpaceEditDialogVisible] = useState(
    false,
  );
  const [
    isNewSpaceErrorMessagVisible,
    setIsNewSpaceErrorMessageVisible,
  ] = useState(false);

  const handleSettingDialogOpen = useCallback(() => {
    setIsCreated(false);
    setSettingDialogVisible(true);
    setSpaceListVisible(false);
  }, []);

  const handleCloseSettingDialog = useCallback(() => {
    setSettingDialogVisible(false);
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(i => !i);
  }, []);

  const handleSpaceList = useCallback(async () => {
    await spaceStore.fetchSpaces({
      userId: userStore.myProfile.id,
      isLocal: process.env.REACT_APP_ENV === 'local',
    });
    setSpaceListVisible(prevVisible => !prevVisible);
    setIsCreated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    // Close dialog first
    if (onCancel) onCancel();
    history.push('/logout');
  };

  const revokeURL = useCallback(() => {
    URL.revokeObjectURL(thumbPhoto);
  }, [thumbPhoto]);

  const handleCancel = useCallback(() => {
    setSpaceListVisible(false);
    setTimeout(() => onCancel(), 1);
  }, [onCancel]);

  const handleCancelInviteMail = useCallback(() => {
    setIsInviteDialogOpen(false);
  }, []);

  const handleInviteDialog = useCallback(() => {
    setIsInviteDialogOpen(true);
    logEvent('threedot', 'clickInviteMemberBtn');
  }, []);

  const handleMemberList = useCallback(async () => {
    setIsViewMode(true);
    setIsFriendMemViewOpen(true);
    logEvent('threedot', 'clickShowMemberList');
  }, []);

  const handleAddFriend = useCallback(async () => {
    setIsViewMode(false);
    setIsFriendMemViewOpen(true);
  }, []);

  const handleSpaceEditDialog = useCallback(() => {
    setIsSpaceEditDialogVisible(true);
  }, []);

  const handleAdminPage = useCallback(() => {
    window.open(`${window.location.origin}/admin`);
  }, []);
  const handleMoveSpacePage = useCallback(() => {
    MovePage('spaces');
  }, []);
  const handleMoveAccountPage = useCallback(() => {
    MovePage('account?open=password');
  }, []);
  const handleOpenSupport = useCallback(() => {
    MovePage('support', true);
  }, []);

  const handleClickNewSpace = () => {
    try {
      const adminSpace = spaceStore.getAdminSpaces({
        loginId: userStore.myProfile?.loginId,
      });
      if (adminSpace.length >= 3) {
        setIsNewSpaceErrorMessageVisible(true);
      } else {
        window.location.href = getMainWaplURL('/select-space-type');
      }
    } catch (e) {
      console.log('SpaceStore Adminspace Get Error...');
    }
  };

  useEffect(() => {
    setIsCreated(created);
  }, [created]);

  const isTmaxDomain = !!/^(tmax)\./gi.exec(window.location.hostname);

  const getBackPhoto = () => {
    return userStore.getBackgroundPhotoURL(userId);
  };

  // 이후 '현재 스페이스의 어드민'인지를 체크하도록 수정
  const moreMenu = (
    <Menu style={{ minWidth: '6.25rem' }}>
      {!isTmaxDomain && !isGuest && !configStore.isFromCNU ? (
        <Menu.Item onClick={handleInviteDialog}>
          {t('CM_USER_INVITE')}
        </Menu.Item>
      ) : null}
      <Menu.Item onClick={handleMemberList}>{t('CM_USER_LIST')}</Menu.Item>
      {isSpaceAdmin() && !configStore.isFromCNU ? (
        <Menu.Item onClick={handleSpaceEditDialog}>
          {t('CM_SPACE_EDIT')}
        </Menu.Item>
      ) : null}
      {isSpaceAdmin() && (
        <Menu.Item onClick={handleAdminPage}>{t('CM_ADMIN_PAGE')}</Menu.Item>
      )}
    </Menu>
  );

  const handleChangeLanguage = async language => {
    const result = await userStore.updateMyLanguage({ language });
    if (result) {
      i18n.changeLanguage(language).then((t, err) => {
        if (err) return console.log(`error is..${err}`);
      });
    }
  };

  const getLanguage = () => {
    const { language } = userStore.myProfile;
    if (!language) return fallbackLanguage;

    const match = language.match(/en|ko/g);
    const isValidLanguage = !!match;
    if (isValidLanguage) return match?.[0];

    return fallbackLanguage;
  };

  const LanguageMenu = (
    <Menu style={{ minWidth: '6.25rem' }}>
      <Menu.Item onClick={() => handleChangeLanguage('ko')}>
        {t('CM_KOREAN')}
      </Menu.Item>
      <Menu.Item onClick={() => handleChangeLanguage('en')}>
        {t('CM_ENGLISH')}
      </Menu.Item>
    </Menu>
  );

  const userContent = !isEditMode ? (
    <>
      <UserImage>
        <img src={thumbPhoto} onLoad={revokeURL} alt="" />
      </UserImage>
      <UserName>{userStore.myProfile?.displayName}</UserName>
      <UserMail>{`(${userStore.myProfile?.loginId})`}</UserMail>
      {userStore.myProfile?.profileStatusMsg && (
        <UserStatus>{userStore.myProfile?.profileStatusMsg}</UserStatus>
      )}

      <UserButtonBox>
        <Button type="link" onClick={toggleEditMode}>
          {t('CM_EDIT_PROFILE')}
        </Button>

        {configStore.isActivateComponent('Platform', 'ChangePassword') ? (
          <>
            <UserBar />
            <Button type="link" onClick={handleMoveAccountPage}>
              {t('CM_PROFILE_MENU_08')}
            </Button>
          </>
        ) : null}
      </UserButtonBox>
      <LogoutButton onClick={handleLogout}>{t('CM_LOGOUT_01')}</LogoutButton>
    </>
  ) : (
    <ProfileInfoModal
      userId={userId}
      visible={isEditMode}
      onClose={toggleEditMode}
      profilePhoto={thumbPhoto}
      editMode
    />
  );

  const subContent = (
    <>
      <UserSpaceArea isEdit={isEditMode}>
        <DataName>{t('CM_SETTING_DELETE_SPACE_03')}</DataName>
        <DataBox>
          <Logo shape="square">{spaceStore.currentSpace?.name[0]}</Logo>
          <Info>
            <Title>{spaceStore.currentSpace?.name}</Title>
            {spaceStore.currentSpace?.domain}
          </Info>
          {configStore.isFromCNU ? null : (
            <Tooltip
              placement="topLeft"
              color="#4C535D"
              title={t('CM_PROFILE_PROFILE_MENU_01')}
            >
              <Button className="btn-convert" onClick={handleSpaceList}>
                <Observer>
                  {() => {
                    const spaceUnreadCount =
                      spaceStore.totalUnreadSpaceCount -
                      spaceStore.currentSpace?.totalUnreadRoomCount;
                    if (spaceUnreadCount > 0) return <NewBadge />;
                    return null;
                  }}
                </Observer>
                <Blind>{t('CM_PROFILE_PROFILE_MENU_01')}</Blind>
              </Button>
            </Tooltip>
          )}
          <Dropdown
            trigger={['click']}
            overlay={moreMenu}
            placement="bottomRight"
          >
            <Tooltip
              placement="topLeft"
              color="#4C535D"
              title={t('CM_PROFILE_PROFILE_MENU_02')}
            >
              <Button className="btn-more">
                <Blind>{t('CM_SETTING')}</Blind>
              </Button>
            </Tooltip>
          </Dropdown>
        </DataBox>
      </UserSpaceArea>
      <Observer>
        {() => (
          <UserSubArea>
            <img alt="lang" src={LanguageIcon} />
            {t('CM_PROFILE_MENU_02', {
              language: getLanguage()?.includes('ko')
                ? t('CM_KOREAN')
                : t('CM_ENGLISH'),
            })}
            <Dropdown
              trigger={['click']}
              overlay={LanguageMenu}
              placement="bottomRight"
            >
              <LanguageButton>
                <ArrowRightIcon color="#7B7671" />
              </LanguageButton>
            </Dropdown>
          </UserSubArea>
        )}
      </Observer>
      {spaceListVisible && (
        <ConvertDropdown>
          <ConvertNow>
            <LogoSmall checked>
              {spaceStore.currentSpace?.totalUnreadRoomCount > 0 && (
                <LogoNumber>
                  {spaceStore.currentSpace?.totalUnreadRoomCount > 99
                    ? '99+'
                    : spaceStore.currentSpace?.totalUnreadRoomCount}
                </LogoNumber>
              )}
              {spaceStore.currentSpace?.name[0]}
            </LogoSmall>
            <NowInfo>
              <NowTitle>{spaceStore.currentSpace?.name}</NowTitle>
              {t('CM_SWITCH_SPACE_01')}
            </NowInfo>
            <Checkbox checked className="check-round" />
          </ConvertNow>
          <ConvertBox>
            {spaceStore.spaceList.length > 1 && (
              <ConvertList>
                {spaceStore.spaceList
                  .filter(elem => elem?.id !== spaceStore.currentSpace?.id)
                  .map(elem => (
                    <ConvertItem
                      onClick={() => {
                        window.location.href = `${window.location.protocol}//${elem.domain}`;
                      }}
                      key={elem?.id}
                    >
                      <LogoSmall>
                        {elem?.totalUnreadRoomCount > 0 && (
                          <LogoNumber>
                            {elem.totalUnreadRoomCount > 99
                              ? '99+'
                              : elem.totalUnreadRoomCount}
                          </LogoNumber>
                        )}
                        {elem?.name[0]}
                      </LogoSmall>
                      <ItemText>{elem?.name}</ItemText>
                    </ConvertItem>
                  ))}
              </ConvertList>
            )}
            <ConvertAdd onClick={handleClickNewSpace}>
              <AddBox>+</AddBox>
              <AddText addSpace>{t('CM_CREATE_CONTENTS_AREA_02')}</AddText>
            </ConvertAdd>
          </ConvertBox>
          <ConvertMove onClick={handleMoveSpacePage}>
            <SquareSpaceIcon />
            {t('CM_GO_SPACES')}
          </ConvertMove>
        </ConvertDropdown>
      )}
      {isCreated && (
        <ProfileSpaceModal
          userName={profile?.displayName}
          onInvite={() => setIsInviteDialogOpen(true)}
          onRoomCreate={() => setIsRoomDialogVisible(true)}
          onAddFriend={handleAddFriend}
          onClose={() => setIsCreated(false)}
        />
      )}
      {settingDialogVisible && (
        <SettingDialog
          visible={settingDialogVisible}
          onCancel={handleCloseSettingDialog}
        />
      )}
      {isInviteDialogOpen && (
        <AddFriendsByInvitationDialog
          visible={isInviteDialogOpen}
          onCancel={handleCancelInviteMail}
        />
      )}
      {isFriendMemViewOpen && (
        <AddFriendsBySearch
          isViewMode={isViewMode}
          onCancelAddFriends={() => setIsFriendMemViewOpen(false)}
        />
      )}
      <SelectRoomTypeDialog
        visible={isRoomDialogVisible}
        onCancel={() => setIsRoomDialogVisible(false)}
        onCreateRoom={({ selectedUsers, isNewRoom }) => {
          if (isNewRoom) {
            setToastText(
              t('CM_INVITE_MEMBER', {
                num: selectedUsers.length,
              }),
            );
            setIsToastOpen(true);
          }
        }}
      />
      <SpaceEditModal
        visible={isSpaceEditDialogVisible}
        onClose={() => setIsSpaceEditDialogVisible(false)}
        onSuccess={() => {
          setToastText(t('CM_CHANGE_SAVE'));
          setIsToastOpen(true);
        }}
      />
      <Toast
        visible={isToastOpen}
        timeoutMs={1000}
        onClose={() => setIsToastOpen(false)}
      >
        {toastText}
      </Toast>
      <Message
        visible={isNewSpaceErrorMessagVisible}
        title={t('CM_SPACE_CREATE_OPTION_ERROR_03')}
        btns={[
          {
            type: 'solid',
            shape: 'round',
            text: t('CM_LOGIN_POLICY_03'),
            onClick: () => setIsNewSpaceErrorMessageVisible(false),
          },
        ]}
      />
    </>
  );

  return useObserver(() => (
    <ProfileModal
      visible={visible}
      mask={isCreated}
      maskClosable={!isCreated}
      onCancel={handleCancel}
      closable={false}
      outLine
      backgroundPhotoURL={getBackPhoto()}
      width="17rem"
      type="user"
      userContent={userContent}
      subContent={subContent}
      footer={
        <UserSettingArea>
          <SettingButton type="text" onClick={handleSettingDialogOpen}>
            {t('CM_SETTING')}
          </SettingButton>
          {!configStore.isFromCNU ? (
            <>
              <SettingBar />
              <SettingButton type="text" onClick={handleOpenSupport}>
                {t('CM_PROFILE_MENU_04')}
              </SettingButton>
            </>
          ) : null}
        </UserSettingArea>
      }
      transitionName=""
      maskTransitionName=""
      style={{ top: '2.875rem', margin: '0 20px 0 auto' }}
    />
  ));
};

export default ProfileMyModal;

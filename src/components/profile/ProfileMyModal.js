import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import {
  useCoreStores,
  Tooltip,
  Toast,
  Message,
  ProfileInfoModal,
  ProfileModal,
  logEvent,
  AddFriendsByInvitationDialog,
  AddFriendsBySearch,
  StatusSelector,
} from 'teespace-core';
import { useHistory } from 'react-router-dom';
import { useObserver, Observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import { useStores } from '../../stores';
import ProfileSpaceModal from './ProfileSpaceModal';
import SelectRoomTypeDialog from '../Rooms/SelectRoomTypeDialog';
import GroupEditModal from './group/GroupEditModal';
import SettingDialog from '../usersettings/SettingDialog';
import MovePage from '../../utils/MovePage';
import { isSpaceAdmin, getLanguage } from '../../utils/GeneralUtil';
import * as useCommand from '../../hook/Command';
import { ArrowRightIcon, LanguageIcon } from '../Icons';
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
  Logo,
  Info,
  Title,
  Blind,
  UserSubArea,
  LanguageButton,
  UserSettingArea,
  SettingButton,
  SettingBar,
  LanguageIconWrap,
  StatusSelectorWrapper,
} from '../../styles/profile/ProfileMyModalStyle';

const ProfileMyModal = ({ onCancel, visible = false, created = false }) => {
  const { t, i18n } = useTranslation();
  const { uiStore } = useStores();
  const { userStore, spaceStore, configStore } = useCoreStores();
  const history = useHistory();

  const [isCreated, setIsCreated] = useState(created);
  const [settingDialogVisible, setSettingDialogVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [invitePeople, setInvitePeople] = useState([]);
  const [isFriendMemViewOpen, setIsFriendMemViewOpen] = useState(false);

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isViewMode, setIsViewMode] = useState(true);

  const [isRoomDialogVisible, setIsRoomDialogVisible] = useState(false);
  const [isGroupEditModalVisible, setIsGroupEditModalVisible] = useState(false);
  const [
    isNewSpaceErrorMessagVisible,
    setIsNewSpaceErrorMessageVisible,
  ] = useState(false);

  const { myProfile } = userStore;
  const { isGuest } = myProfile;
  const myUserId = myProfile.id;
  const thumbPhoto = userStore.getProfilePhotoURL(myUserId, 'medium');

  const themeContext = useContext(ThemeContext);

  const handleSettingDialogOpen = useCallback(() => {
    setIsCreated(false);
    setSettingDialogVisible(true);
  }, []);
  const handleCloseSettingDialog = useCallback(() => {
    setSettingDialogVisible(false);
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(i => !i);
  }, []);

  const handleLogout = useCallback(async () => {
    // Close dialog first
    if (onCancel) onCancel();
    history.push('/logout');
  }, []);

  const revokeURL = useCallback(() => {
    URL.revokeObjectURL(thumbPhoto);
  }, [thumbPhoto]);

  const handleCancel = useCallback(() => {
    setTimeout(() => onCancel(), 1);
  }, [onCancel]);

  const handleOpenInviteModal = useCallback(
    (mailAddr = []) => () => {
      setInvitePeople(mailAddr);
      setIsInviteDialogOpen(true);
      logEvent('threedot', 'clickInviteMemberBtn');
    },
    [],
  );
  const handleCancelInviteModal = useCallback(() => {
    setIsInviteDialogOpen(false);
  }, []);

  const handleOpenMemberModal = useCallback(async () => {
    setIsViewMode(true);
    setIsFriendMemViewOpen(true);
    logEvent('threedot', 'clickShowMemberList');
  }, []);

  const handleOpenGroupEditModal = useCallback(() => {
    setIsGroupEditModalVisible(true);
  }, []);

  const handleAddFriend = useCallback(async () => {
    setIsViewMode(false);
    setIsFriendMemViewOpen(true);
  }, []);

  const handleMoveAdminPage = useCallback(() => {
    window.open(`${window.location.origin}/admin`);
  }, []);
  const handleMovePasswordPage = useCallback(() => {
    MovePage('account?open=password');
  }, []);
  const handleOpenSupport = useCallback(() => {
    MovePage('support', true);
  }, []);

  const getBackPhoto = () => {
    return userStore.getBackgroundPhotoURL(myUserId);
  };

  useEffect(() => {
    setIsCreated(created);
  }, [created]);

  const isTmaxDomain = !!/^(tmax)\./gi.exec(window.location.hostname);

  const moreMenu = (
    <Menu style={{ minWidth: '6.25rem' }}>
      {!isTmaxDomain && !isGuest && !configStore.isFromCNU ? (
        <Menu.Item onClick={handleOpenInviteModal()}>
          {t('CM_USER_INVITE')}
        </Menu.Item>
      ) : null}
      <Menu.Item onClick={handleOpenMemberModal}>{t('CM_USER_LIST')}</Menu.Item>
      {isSpaceAdmin() && !configStore.isFromCNU ? (
        <Menu.Item onClick={handleOpenGroupEditModal}>
          {t('CM_SPACE_EDIT')}
        </Menu.Item>
      ) : null}
      {isSpaceAdmin() && (
        <Menu.Item onClick={handleMoveAdminPage}>
          {t('CM_ADMIN_PAGE')}
        </Menu.Item>
      )}
    </Menu>
  );

  const handleChangeLanguage = async language => {
    const result = await userStore.updateMyDomainSetting({ language });
    if (result) {
      i18n.changeLanguage(language).then((t, err) => {
        if (err) return console.log(`error is..${err}`);
      });
    }
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
      <StatusSelectorWrapper>
        <StatusSelector selectable userId={myProfile.id} />
      </StatusSelectorWrapper>
      <UserImage>
        <img src={thumbPhoto} onLoad={revokeURL} alt="" />
      </UserImage>
      <UserName>{myProfile.displayName}</UserName>
      <UserMail>{`(${myProfile.loginId})`}</UserMail>
      {myProfile.profileStatusMsg && (
        <UserStatus>{myProfile.profileStatusMsg}</UserStatus>
      )}

      <UserButtonBox>
        <Button
          className="header-profile__edit-button"
          type="link"
          onClick={toggleEditMode}
        >
          {t('CM_EDIT_PROFILE')}
        </Button>

        {configStore.isActivateComponent('Platform', 'ChangePassword') ? (
          <>
            <UserBar />
            <Button
              className="header-profile__password-button"
              type="link"
              onClick={handleMovePasswordPage}
            >
              {t('CM_PROFILE_MENU_08')}
            </Button>
          </>
        ) : null}
      </UserButtonBox>
      {!configStore.isFromCNU ? (
        <LogoutButton
          className="header-profile__logout-button"
          onClick={handleLogout}
        >
          {t('CM_LOGOUT_01')}
        </LogoutButton>
      ) : null}
    </>
  ) : (
    <ProfileInfoModal
      userId={myUserId}
      visible={isEditMode}
      onClose={toggleEditMode}
      profilePhoto={thumbPhoto}
      onClickMeeting={roomId => {
        uiStore.openWindow({
          id: roomId,
          type: 'meeting',
          name: null,
          userCount: null,
          handler: null,
        });
      }}
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
          <Dropdown
            trigger={['click']}
            overlay={moreMenu}
            placement="bottomRight"
          >
            <Tooltip
              placement="topLeft"
              color={themeContext.CoreLight}
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
            <LanguageIconWrap>
              <LanguageIcon
                width={1.25}
                height={1.25}
                color={themeContext.IconNormal}
              />
            </LanguageIconWrap>
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
              <LanguageButton className="header-profile__language-button">
                <ArrowRightIcon color={themeContext.IconNormal} />
              </LanguageButton>
            </Dropdown>
          </UserSubArea>
        )}
      </Observer>
      {isCreated && (
        <ProfileSpaceModal
          userName={myProfile.displayName}
          onInvite={() => setIsInviteDialogOpen(true)}
          onRoomCreate={() => setIsRoomDialogVisible(true)}
          onAddFriend={handleAddFriend}
          onClose={() => setIsCreated(false)}
        />
      )}
      {isFriendMemViewOpen && (
        <AddFriendsBySearch
          isViewMode={isViewMode}
          onCancelAddFriends={() => setIsFriendMemViewOpen(false)}
          isTopOrg={false}
          isMeVisible
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
      {isGroupEditModalVisible && (
        <GroupEditModal
          onClose={() => setIsGroupEditModalVisible(false)}
          onSuccess={() => {
            setToastText(t('CM_CHANGE_SAVE'));
            setIsToastOpen(true);
          }}
        />
      )}
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

  useCommand.Setting(handleSettingDialogOpen);
  useCommand.InvitePeople(handleOpenInviteModal);
  useCommand.Logout(handleLogout);
  useCommand.Help(handleOpenSupport);

  return useObserver(() => (
    <>
      {visible ? (
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
          style={{ top: '2.875rem', margin: '0 1.25rem 0 auto' }}
        />
      ) : null}
      {settingDialogVisible && (
        <SettingDialog
          visible={settingDialogVisible}
          onCancel={handleCloseSettingDialog}
        />
      )}
      {isInviteDialogOpen && (
        <AddFriendsByInvitationDialog
          visible={isInviteDialogOpen}
          mailList={invitePeople}
          onCancel={handleCancelInviteModal}
        />
      )}
    </>
  ));
};

export default ProfileMyModal;

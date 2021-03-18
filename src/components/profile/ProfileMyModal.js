import React, { useEffect, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Button, Avatar, Dropdown, Menu, Checkbox, Tooltip } from 'antd';
import {
  useCoreStores,
  Toast,
  Message,
  ProfileInfoModal,
  ProfileModal,
  logEvent,
} from 'teespace-core';
import { useHistory } from 'react-router-dom';
import { useObserver } from 'mobx-react';
// import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import PlatformUIStore from '../../stores/PlatformUIStore';
import SettingDialog from '../usersettings/SettingDialog';
import ProfileSpaceModal from './ProfileSpaceModal';
import convertSpaceIcon from '../../assets/convert_space.svg';
import moreSpaceIcon from '../../assets/view_more.svg';
import checkekIcon from '../../assets/ts_check.svg';
import { ReactComponent as SquareSpaceIcon } from '../../assets/card_view.svg';
import AddFriendsByInvitationDialog from '../friends/AddFriendsByInvitationDialog';
import AddFriendsBySearch from '../friends/AddFriendsBySearch';
import SelectRoomTypeDialog from '../Rooms/SelectRoomTypeDialog';
import SpaceEditModal from './SpaceEditModal';
import MovePage from '../../utils/MovePage';
import { SELECTED_TAB } from '../usersettings/SettingConstants';
import { getMainWaplURL } from '../../utils/UrlUtil';
import { handleFriendsDialogType } from '../../utils/FriendsUtil';

const ProfileMyModal = ({
  userId,
  onCancel,
  thumbPhoto,
  visible = false,
  created = false,
}) => {
  const { t } = useTranslation();
  const { userStore, spaceStore } = useCoreStores();
  const history = useHistory();
  const [isCreated, setIsCreated] = useState(created);
  const [profile, setProfile] = useState(null);
  const [itemKey, setItemKey] = useState(SELECTED_TAB.GENERAL);
  const [settingDialogVisible, setSettingDialogVisible] = useState(false);
  const [spaceListVisible, setSpaceListVisible] = useState(false);
  const [moreMenuDropDownVisible, setMoreMenuDropDownVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isFriendMemViewOpen, setIsFriendMemViewOpen] = useState(false);

  const [spaceMemberList, setSpaceMemberList] = useState([]);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const [isViewMode, setIsViewMode] = useState(true);

  const [isOrgExist, setIsOrgExist] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const [isRoomDialogVisible, setIsRoomDialogVisible] = useState(false);
  const [isSpaceEditDialogVisible, setIsSpaceEditDialogVisible] = useState(
    false,
  );
  const [
    isNewSpaceErrorMessagVisible,
    setIsNewSpaceErrorMessageVisible,
  ] = useState(false);

  const isAdmin = userStore.myProfile.grade === 'admin';

  // 1월 업데이트
  // const [lngListVisible, setLngListVisible] = useState(false);
  //

  // eslint-disable-next-line no-unused-vars
  const handleSettingDialogOpen = useCallback(e => {
    setItemKey(e);
    setIsCreated(false);
    setSettingDialogVisible(true);
    setSpaceListVisible(false);
  }, []);

  const handleSettingDialogClose = useCallback(() => {
    setItemKey(SELECTED_TAB.ALARM);
    setSettingDialogVisible(false);
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(i => !i);
  }, []);

  const handleSpaceList = useCallback(() => {
    setSpaceListVisible(prevVisible => !prevVisible);
    setIsCreated(false);
  }, []);

  const handleMoreMenuDropDownVisible = () => {
    setMoreMenuDropDownVisible(!moreMenuDropDownVisible);
  };

  const handleLogout = async () => {
    // Close dialog first
    if (onCancel) onCancel();
    history.push('/logout');
  };

  const revokeURL = useCallback(() => {
    URL.revokeObjectURL(thumbPhoto);
  }, [thumbPhoto]);

  // 1월 업데이트
  // const handleToggleLngList = useCallback(() => {
  //   setLngListVisible(l => !l);
  //   useProfile.setState({ ...useProfile.state, created: false });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [useProfile]);

  // const handleLanguage = useCallback(lng => {
  //   setLngListVisible(l => false);
  //   i18n.changeLanguage(lng);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleCancel = useCallback(() => {
    setSpaceListVisible(false);
    setMoreMenuDropDownVisible(false);
    setTimeout(() => onCancel(), 1);
  }, [onCancel]);

  const handleCancelInviteMail = useCallback(() => {
    setIsInviteDialogOpen(false);
  }, []);

  const handleInviteDialog = useCallback(() => {
    setMoreMenuDropDownVisible(false);
    setIsInviteDialogOpen(true);
    logEvent('threedot', 'clickInviteMemberBtn');
  }, []);

  const handleMemberList = useCallback(async () => {
    setMoreMenuDropDownVisible(false);
    try {
      await handleFriendsDialogType(
        () => setIsOrgExist(true),
        res => setSpaceMemberList(res),
      );
      setIsViewMode(true);
      setModalTitle(spaceStore.currentSpace?.name);
      setIsFriendMemViewOpen(true);
      logEvent('threedot', 'clickShowMemberList');
    } catch (e) {
      console.log('service Error...');
    }
  }, [spaceStore]);

  const handleAddFriend = useCallback(async () => {
    await handleFriendsDialogType(
      () => setIsOrgExist(true),
      res => setSpaceMemberList(res),
    );
    setIsViewMode(false);
    setModalTitle(t('CM_ADD_PHOTO_FRIENDS'));
    setIsFriendMemViewOpen(true);
  }, []);

  const handleSpaceEditDialog = useCallback(() => {
    setMoreMenuDropDownVisible(false);
    setIsSpaceEditDialogVisible(true);
  }, []);

  const handleAdminPage = useCallback(() => {
    setMoreMenuDropDownVisible(false);
    window.open(`${window.location.origin}/admin`);
  }, []);

  const handleMoveSpacePage = useCallback(() => {
    MovePage('spaces');
  }, []);

  const handleMoveAccountPage = useCallback(() => {
    MovePage('account?open=password');
  }, []);

  const handleOpenSupport = () => {
    MovePage('support', true);
  };

  const handleClickNewSpace = useCallback(() => {
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
  }, [spaceStore, userStore]);

  useEffect(() => {
    if (isEditMode === true) return;
    (async () => {
      const userProfile = await userStore.getProfile({ userId });
      setProfile(userProfile);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, userStore]);

  useEffect(() => {
    setIsCreated(created);
  }, [created]);

  const isTmaxDomain = !!/^(tmax)\./gi.exec(window.location.hostname);

  // 이후 '현재 스페이스의 어드민'인지를 체크하도록 수정
  const moreMenu = (
    <Menu style={{ minWidth: '6.25rem' }}>
      {!isTmaxDomain ? (
        <Menu.Item onClick={handleInviteDialog}>
          {t('CM_USER_INVITE')}
        </Menu.Item>
      ) : null}
      <Menu.Item onClick={handleMemberList}>{t('CM_USER_LIST')}</Menu.Item>
      {isAdmin && (
        <Menu.Item onClick={handleSpaceEditDialog}>
          {t('CM_SPACE_EDIT')}
        </Menu.Item>
      )}
      {isAdmin && (
        <Menu.Item onClick={handleAdminPage}>{t('CM_ADMIN_PAGE')}</Menu.Item>
      )}
    </Menu>
  );

  const userContent = !isEditMode ? (
    <>
      <UserImage>
        <img src={thumbPhoto} onLoad={revokeURL} alt="" />
      </UserImage>
      <UserName>
        {userStore.myProfile?.nick || userStore.myProfile?.name}
      </UserName>
      <UserMail>{`(${userStore.myProfile?.loginId})`}</UserMail>
      <UserButtonBox>
        <Button type="link" onClick={toggleEditMode}>
          {t('CM_EDIT_PROFILE')}
        </Button>
        <UserBar />
        <Button type="link" onClick={handleMoveAccountPage}>
          {t('CM_PROFILE_MENU_08')}
        </Button>
      </UserButtonBox>
      <LogoutButton onClick={handleLogout}>{t('CM_LOGOUT_01')}</LogoutButton>
    </>
  ) : (
    <ProfileInfoModal
      userId={userId}
      visible={isEditMode}
      onClose={toggleEditMode}
      profilePhoto={thumbPhoto}
      onClickMeeting={roomId => {
        PlatformUIStore.openWindow({
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
          <Tooltip
            placement="topLeft"
            color="#4C535D"
            title={t('CM_PROFILE_PROFILE_MENU_01')}
          >
            <Button className="btn-convert" onClick={handleSpaceList}>
              <Blind>{t('CM_PROFILE_PROFILE_MENU_01')}</Blind>
            </Button>
          </Tooltip>
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
      {/* 1월 업데이트 */}
      {/* <UserSubArea>
        <SubInfo tabIndex="-1" onClick={handleToggleLngList}>
          <LangSpaceIcon />
          Language : {i18n.language === 'ko' ? t('CM_KOREAN') : t('CM_ENGLISH')}
          <LangIcon>
            <ArrowRightIcon />
          </LangIcon>
        </SubInfo>
        {lngListVisible && (
          <LngList>
            <LangItem
              checked={i18n.language === 'ko'}
              onClick={handleLanguage.bind(this, 'ko')}
            >
              {t('CM_KOREAN')}
            </LangItem>
            <LangItem
              checked={i18n.language === 'en'}
              onClick={handleLanguage.bind(this, 'en')}
            >
              {t('CM_ENGLISH')}
            </LangItem>
          </LngList>
        )}
      </UserSubArea> */}
      {spaceListVisible && (
        <ConvertDropdown>
          <ConvertNow>
            <LogoSmall checked>
              {spaceStore.currentSpace?.unreadSpaceCount && (
                <LogoNumber>
                  {spaceStore.currentSpace?.unreadSpaceCount > 99
                    ? '99+'
                    : spaceStore.currentSpace?.unreadSpaceCount}
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
                      key={elem}
                    >
                      <LogoSmall>
                        {elem?.unreadSpaceCount && (
                          <LogoNumber>
                            {elem.unreadSpaceCount > 99
                              ? '99+'
                              : elem.unreadSpaceCount}
                          </LogoNumber>
                        )}
                        {elem?.name[0]}
                      </LogoSmall>
                      <ItemText>{elem?.name}</ItemText>
                    </ConvertItem>
                  ))}
              </ConvertList>
            )}
            <ConvertAdd onClick={() => handleClickNewSpace()}>
              <AddBox>+</AddBox>
              <AddText addSpace>{t('CM_CREATE_CONTENTS_AREA_02')}</AddText>
            </ConvertAdd>
          </ConvertBox>
          <ConvertMove onClick={() => handleMoveSpacePage()}>
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
      <SettingDialog
        selectedKeyA={itemKey}
        visible={settingDialogVisible}
        onCancel={handleSettingDialogClose}
      />
      <AddFriendsByInvitationDialog
        visible={isInviteDialogOpen}
        onSendInviteMail={() => {
          setToastText(t('CM_INVITE_PEOPLE_POPUP_07'));
          setIsToastOpen(true);
        }}
        onCancel={handleCancelInviteMail}
      />
      <AddFriendsBySearch
        visible={isFriendMemViewOpen}
        onCancelAddFriends={() => setIsFriendMemViewOpen(false)}
        isOrgExist={isOrgExist}
        title={modalTitle}
        isViewMode={isViewMode}
        spaceInfo={spaceStore.currentSpace}
        spaceMemberList={spaceMemberList}
      />
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
        onClose={() => {
          setIsToastOpen(false);
        }}
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
      width="17rem"
      type="user"
      userContent={userContent}
      subContent={subContent}
      footer={
        <UserSettingArea>
          <SettingButton
            type="text"
            onClick={() => handleSettingDialogOpen(SELECTED_TAB.ALARM)}
          >
            {t('CM_SETTING')}
          </SettingButton>
          <SettingBar />
          <SettingButton type="text" onClick={handleOpenSupport}>
            {t('CM_PROFILE_MENU_04')}
          </SettingButton>
        </UserSettingArea>
      }
      transitionName=""
      maskTransitionName=""
      style={{ top: '2.875rem', margin: '0 20px 0 auto' }}
    />
  ));
};

const UserImage = styled.span`
  display: inline-block;
  position: relative;
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
  background-color: #fff;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;
const UserName = styled.p`
  overflow: hidden;
  margin-top: 0.5rem;
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.25rem;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const UserMail = styled.span`
  display: block;
  overflow: hidden;
  margin-top: 0.13rem;
  font-size: 0.69rem;
  opacity: 0.8;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const UserButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.875rem;
  font-size: 0.69rem;
  opacity: 0.8;
  .ant-btn.ant-btn-link {
    min-width: auto;
    height: auto;
    padding: 0 0.375rem;
    font-size: 0.75rem;
    line-height: 1.13rem;
    color: #f7f4ef;
    &:hover span {
      text-decoration: underline;
    }
  }
`;
// eslint-disable-next-line no-unused-vars
const UserBar = styled.span`
  display: inline-block;
  width: 1px;
  height: 0.81rem;
  margin: 0 0.375rem;
  opacity: 0.6;
  background: #fff;
`;
const LogoutButton = styled(Button)`
  &.ant-btn {
    margin-top: 0.5rem;
    width: 100%;
    color: #f7f4ef;
    background-color: transparent;
    border-color: #f7f4ef;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      border-color: #ebe6df;
      color: #ebe6df;
    }
    &:active,
    &:focus {
      background-color: #ddd7cd;
      border-color: #ddd7cd;
      color: #fff;
    }
  }
`;
const UserSpaceArea = styled.div`
  position: relative;
  padding: 0.625rem 0.5rem 1.06rem 0.875rem;
  background-color: #fbf9f7;
  border-radius: 0 0 0.25rem 0.25rem;
  ${props =>
    !props.isEdit &&
    css`
      &:before {
        content: '';
        position: absolute;
        top: -1rem;
        left: 0;
        right: 0;
        height: 1rem;
        background-color: #fbf9f7;
      }
    `};
`;
const DataName = styled.p`
  margin-bottom: 0.5rem;
  font-size: 0.63rem;
  line-height: 0.94rem;
  color: #777;
`;
const DataBox = styled.div`
  display: flex;
  align-items: center;
  .ant-btn {
    min-width: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 1rem 1rem;
    &:hover {
      background-color: #f2efec;
    }
    &:active,
    &:focus {
      background-color: #f2efec;
    }
  }
  .btn-convert {
    background-image: url('${convertSpaceIcon}');
  }
  .btn-more {
    margin-left: 0.125rem;
    background-image: url('${moreSpaceIcon}');
  }
`;
const Logo = styled(Avatar)`
  flex-shrink: 0;
  width: 2.64rem;
  height: 2.64rem;
  font-size: 1.125rem;
  line-height: 2.375rem;
  font-weight: 500;
  color: #49423a;
  border-radius: 0.25rem;
  background-color: #ebe6df;
`;
const Info = styled.p`
  overflow: hidden;
  flex: 1;
  margin: 0 0.625rem;
  font-size: 0.6875rem;
  color: #777;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const Title = styled.strong`
  overflow: hidden;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000;
  line-height: 1.25rem;
  text-overflow: ellipsis;
`;
const Blind = styled.span`
  position: absolute;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
`;
const UserSubArea = styled.div`
  & + & {
    border-top: 1px solid #e3e7eb;
  }
`;
const SubInfo = styled.p`
  display: flex;
  align-items: center;
  position: relative;
  padding: 0.6875rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.875rem;
  cursor: pointer;
  svg {
    color: #75757f;
  }
  & + & {
    border-top: 1px solid #eeedeb;
  }
  &:hover {
    background-color: #faf8f7;
    text-decoration: none;
  }
  &:active,
  &:focus {
    background-color: #f2efec;
    svg {
      color: #43434a;
    }
  }
`;
// eslint-disable-next-line no-unused-vars
const LangIcon = styled.span`
  margin-left: auto;
  line-height: 0;
  svg {
    width: 1rem;
    height: 1rem;
  }
`;
// eslint-disable-next-line no-unused-vars
const LngList = styled.ul`
  position: absolute;
  left: -5.27rem;
  width: 5.19rem;
  margin-top: -3.25rem;
  padding: 0.25rem 0;
  background-color: #fff;
  border: 1px solid #c6ced6;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
`;
// eslint-disable-next-line no-unused-vars
const LangItem = styled.li`
  position: relative;
  padding-left: 1.63rem;
  font-size: 0.75rem;
  color: #000;
  line-height: 2.125rem;
  border-radius: 1.25rem;
  cursor: pointer;
  ${props =>
    props.checked &&
    css`
      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0.56rem;
        width: 0.75rem;
        height: 0.75rem;
        transform: translateY(-50%);
        background-image: url('${checkekIcon}');
        background-size: contain;
      }
    `};
  &:hover {
    background: #dcddff;
  }
  &:active,
  &:focus {
    background-color: #bcbeff;
  }
`;
const ConvertDropdown = styled.div`
  position: absolute;
  left: -12.5rem;
  width: 12rem;
  top: 15.63rem;
  border: 1px solid #c6ced6;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  background-color: #fff;
  z-index: 1050;
`;
const ConvertNow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.3125rem 0.6875rem;
  margin-top: 0.44rem;
`;
const LogoSmall = styled.div`
  position: relative;
  width: 2.63rem;
  height: 2.63rem;
  font-size: 0.96rem;
  line-height: 1.96rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.32rem;
  background-color: #ebe6df;
  color: #0a1e3a;
  margin-right: 0.375rem;
  ${props =>
    props.checked &&
    css`
      line-height: 1.625rem;
      border: 1px solid #0a1e3a;
    `}
`;
const LogoNumber = styled.div`
  position: absolute;
  line-height: 1.4;
  top: 0.15rem;
  right: 0.15rem;
  background-color: rgb(220, 69, 71);
  color: rgb(255, 255, 255);
  font-size: 0.52rem;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.4rem;
  padding: 0 0.2rem;
`;
const NowInfo = styled(Info)`
  margin: 0 0.375rem 0 0;
  font-size: 0.625rem;
  line-height: 0.9375rem;
`;
const NowTitle = styled(Title)`
  font-size: 0.75rem;
  line-height: 1.125rem;
`;
const ConvertList = styled.ul`
  overflow-y: auto;
  max-height: 11.25rem;
`;
const ConvertItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.3125rem 0.6875rem;
  color: #000;
  cursor: pointer;
  .ant-avatar {
    margin-right: 0.375rem;
  }
  &:hover {
    background-color: #faf8f7;
  }
`;
const ItemText = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => (props.addSpace ? '#666666' : '#000000')};
`;
const ConvertBox = styled.div`
  padding: 0.31rem 0;
`;
const ConvertAdd = styled.div`
  display: flex;
  padding: 0.3125rem 0.6875rem;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
`;
const AddBox = styled.span`
  height: 2.63rem;
  width: 2.63rem;
  background-color: #faf8f7;
  border-radius: 0.32rem;
  margin-right: 0.375rem;
  font-size: 0.88rem;
  line-height: 1.75rem;
  color: #49423a;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const AddText = styled.span`
  font-size: 0.75rem;
  color: #666;
`;
const ConvertMove = styled.div`
  padding: 0.63rem 1.13rem;
  border-top: 1px solid #eeedeb;
  font-size: 0.69rem;
  font-weight: 500;
  color: #00493d;
  cursor: pointer;
  svg {
    margin-right: 0.4rem;
    width: 1rem;
    height: 1rem;
    vertical-align: top;
  }
`;
const UserSettingArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 0;
  border-top: 1px solid #eeedeb;
`;
const SettingButton = styled(Button)`
  width: 4.375rem;
  padding: 0 !important;
`;
// eslint-disable-next-line no-unused-vars
const SettingBar = styled.span`
  display: inline-block;
  width: 0.1875rem;
  height: 0.1875rem;
  margin: 0 0.375rem;
  background-color: #7b7671;
  border-radius: 50%;
`;

export default ProfileMyModal;

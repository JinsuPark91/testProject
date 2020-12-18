import React, { useEffect, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Button, Avatar, Dropdown, Menu, Checkbox } from 'antd';
import { useCoreStores, Toast, WWMS } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import { useObserver } from 'mobx-react';
// import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import ProfileModal from './ProfileModal';
import SettingDialog from '../usersettings/SettingDialog';
import ProfileSpaceModal from './ProfileSpaceModal';
import convertSpaceIcon from '../../assets/convert space.svg';
import moreSpaceIcon from '../../assets/view_more.svg';
import checkekIcon from '../../assets/ts_check.svg';
import { ReactComponent as SquareSpaceIcon } from '../../assets/thumbnail.svg';
import ProfileInfoModal from './ProfileInfoModal';
import AddFriendsByInvitationDialog from '../friends/AddFriendsByInvitationDialog';
import AddFriendsBySearch from '../friends/AddFriendsBySearch';
import PlatformUIStore from '../../stores/PlatformUIStore';

import keycloak from '../../libs/keycloak';

const ProfileMyModal = ({
  userId,
  onCancel,
  thumbPhoto,
  visible = false,
  created = false,
}) => {
  const { userStore, authStore, spaceStore, orgStore } = useCoreStores();
  const history = useHistory();
  const [isCreated, setIsCreated] = useState(created);
  const [profile, setProfile] = useState(null);
  const [itemKey, setItemKey] = useState('2');
  const [settingDialogVisible, setSettingDialogVisible] = useState(false);
  const [spaceListVisible, setSpaceListVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isSpaceMemViewOpen, setIsSpaceMemViewOpen] = useState(false);
  const [spaceMemberList, setSpaceMemberList] = useState([]);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const { keycloak } = useKeycloak();

  const isAdmin = userStore.myProfile.grade === 'admin';

  // 1월 업데이트
  // const [lngListVisible, setLngListVisible] = useState(false);
  // const { i18n } = useTranslation();

  // eslint-disable-next-line no-unused-vars
  const handleSettingDialogOpen = useCallback(e => {
    setItemKey(e);
    setIsCreated(false);
    setSettingDialogVisible(true);
    setSpaceListVisible(false);
  }, []);

  const handleSettingDialogClose = useCallback(() => {
    setSettingDialogVisible(false);
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(i => !i);
  }, []);

  const handleSpaceList = useCallback(() => {
    setSpaceListVisible(prevVisible => !prevVisible);
    setIsCreated(false);
  }, []);

  const handleSwitchSpace = useCallback(() => {
    setSpaceListVisible(false);
  }, []);

  const handleLogout = async () => {
    /* keycloak 임시 코드 */
    const url = window.location.origin; //  http://xxx.dev.teespace.net
    const con_url = url.split(`//`)[1]; // xxx.dev.teespace.net
    const main_url = con_url.slice(con_url.indexOf('.') + 1, con_url.length); // dev.teespace.net

    await authStore.logout({});
    if (process.env.REACT_APP_ENV === `local`) {
      WWMS.disconnect();
      history.push(`/login`);
    } else {
      WWMS.disconnect();
      /* keycloak 임시 logout */
      await keycloak.logout({
        redirectUri: `http://${main_url}/spaces`,
      });
    }
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
  const toggleInviteDialog = useCallback(() => {
    setIsInviteDialogOpen(!isInviteDialogOpen);
    setIsToastOpen(true);
  }, [isInviteDialogOpen]);

  const toggleSpaceMemViewDialog = useCallback(() => {
    setIsSpaceMemViewOpen(!isSpaceMemViewOpen);
  }, [isSpaceMemViewOpen]);

  const handleInviteDialog = useCallback(() => {
    setIsInviteDialogOpen(true);
  }, []);

  const handleMemberList = useCallback(async () => {
    const { myProfile } = userStore;
    try {
      const response = await orgStore.getUserOrgUserList(
        myProfile?.companyCode,
        myProfile?.departmentCode,
        myProfile?.id,
        // PlatformUIStore.domainKey,
      );
      setSpaceMemberList(response);
    } catch (e) {
      console.log('getUserList Error');
    }
    toggleSpaceMemViewDialog();
  }, [orgStore, userStore, toggleSpaceMemViewDialog]);

  const handleSpaceEditDialog = useCallback(() => {
    console.log('MemberList');
  }, []);

  const handleAdminPage = useCallback(() => {
    window.open(`${window.location.href}/admin`);
  }, []);

  const handleMoveSpacePage = useCallback(() => {
    const url = window.location.href;
    const purl = url?.split('.');
    if (
      purl[0].match('127') ||
      purl[0].match('192') ||
      purl[0].match('local')
    ) {
      window.open(`${window.location.protocol}//dev.wapl.ai/spaces`);
    } else {
      const tdomain = purl[1];
      if (purl[1] === 'wapl') {
        window.open(`${window.location.protocol}//wapl.ai/spaces`);
      } else {
        window.open(
          `${window.location.protocol}//` + tdomain + `wapl.ai/spaces`,
        );
      }
    }
  }, []);

  const handleOpenSupport = () => {
    const url = window.location.href;
    const purl = url?.split('.');
    if (
      purl[0].match('127') ||
      purl[0].match('192') ||
      purl[0].match('local')
    ) {
      window.open(`${window.location.protocol}//dev.wapl.ai/support`);
    } else {
      const tdomain = purl[1];
      if (purl[1] === 'wapl') {
        window.open(`${window.location.protocol}//wapl.ai/support`);
      } else {
        window.open(
          `${window.location.protocol}//` + tdomain + `wapl.ai/support`,
        );
      }
    }
  };

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

  // 이후 '현재 스페이스의 어드민'인지를 체크하도록 수정
  const moreMenu = (
    <Menu style={{ minWidth: '6.25rem' }}>
      <Menu.Item onClick={handleInviteDialog}>구성원 초대</Menu.Item>
      <Menu.Item onClick={handleMemberList}>구성원 목록</Menu.Item>
      {isAdmin && (
        <Menu.Item onClick={handleSpaceEditDialog}>스페이스 편집</Menu.Item>
      )}
      {isAdmin && (
        <Menu.Item onClick={handleAdminPage}>어드민 페이지</Menu.Item>
      )}
    </Menu>
  );
  const userContent = !isEditMode ? (
    <>
      <UserImage src={thumbPhoto} onLoad={revokeURL} />
      <UserName>
        {userStore.myProfile?.nick || userStore.myProfile?.name}
      </UserName>
      <UserMail>{`(${userStore.myProfile?.loginId})`}</UserMail>
      <UserButtonBox>
        <Button type="link" onClick={toggleEditMode}>
          프로필 편집
        </Button>
        {/* <UserBar />
        <Button type="link" onClick={handleSettingDialogOpen.bind(this, '6')}>
          비밀번호 변경
        </Button> */}
      </UserButtonBox>
      <LogoutButton shape="round" onClick={handleLogout}>
        로그아웃
      </LogoutButton>
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

  const spaceViewList = spaceStore.spaceList.filter(
    elem => elem.id !== spaceStore.currentSpace.id,
  );

  const subContent = (
    <>
      <UserSpaceArea isEdit={isEditMode}>
        <DataName>현재 스페이스</DataName>
        <DataBox>
          <Logo
            shape="square"
            style={{ color: '#fff', backgroundColor: '#75757F' }}
          >
            {spaceStore.currentSpace?.name[0]}
          </Logo>
          <Info>
            <Title>{spaceStore.currentSpace?.name}</Title>
            {spaceStore.currentSpace?.name}
          </Info>
          {/* <Button
            type="circle"
            className="btn-convert"
            onClick={handleSpaceList}
          >
            <Blind>스페이스 전환</Blind>
          </Button> */}
          <Dropdown
            trigger={['click']}
            overlay={moreMenu}
            placement="bottomRight"
          >
            <Button type="circle" className="btn-more">
              <Blind>설정</Blind>
            </Button>
          </Dropdown>
        </DataBox>
      </UserSpaceArea>
      <UserSubArea>
        <SubInfo tabIndex="-1" onClick={handleMoveSpacePage}>
          <LinkIcon>
            <SquareSpaceIcon />
          </LinkIcon>
          스페이스 목록으로 이동
        </SubInfo>
      </UserSubArea>
      {/* 1월 업데이트 */}
      {/* <UserSubArea>
        <SubInfo tabIndex="-1" onClick={handleToggleLngList}>
          <LinkIcon>
            <LangSpaceIcon />
          </LinkIcon>
          Language : {i18n.language === 'ko' ? '한국어' : 'English'}
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
              한국어
            </LangItem>
            <LangItem
              checked={i18n.language === 'en'}
              onClick={handleLanguage.bind(this, 'en')}
            >
              English
            </LangItem>
          </LngList>
        )}
      </UserSubArea> */}
      {spaceListVisible && (
        <ConvertDropdown>
          <ConvertNow>
            <LogoSmall
              shape="square"
              checked
              style={{ color: '#fff', backgroundColor: '#75757F' }}
            >
              {spaceStore.currentSpace?.name[0]}
            </LogoSmall>
            <NowInfo>
              <NowTitle>{spaceStore.currentSpace?.name}</NowTitle>
              현재 스페이스입니다.
            </NowInfo>
            <Checkbox checked className="check-round" />
          </ConvertNow>
          {spaceViewList.length > 0 && (
            <ConvertList>
              {spaceStore.spaceList.map(elem => (
                <ConvertItem
                  onClick={() => window.location.replace(elem.domain)}
                  key={elem}
                >
                  <LogoSmall
                    shape="square"
                    style={{ color: '#fff', backgroundColor: '#75757F' }}
                  >
                    {elem?.name[0]}
                  </LogoSmall>
                  <ItemText>{elem?.name}</ItemText>
                </ConvertItem>
              ))}
            </ConvertList>
          )}
          <ConvertAdd>
            <AddButton href="#">
              <span>+</span> 새 스페이스 생성
            </AddButton>
          </ConvertAdd>
        </ConvertDropdown>
      )}
      {isCreated && (
        <ProfileSpaceModal
          oneButton={isAdmin}
          userName={profile?.name}
          onInvite={() => console.log('')}
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
        onCancel={toggleInviteDialog}
      />
      <AddFriendsBySearch
        visible={isSpaceMemViewOpen}
        onCancelAddFriends={toggleSpaceMemViewDialog}
        isOrgExist={false}
        isSpaceEmpty={false}
        title={spaceStore.currentSpace?.name}
        isViewMode
        spaceMemberList={spaceMemberList}
      />
      <Toast
        visible={isToastOpen}
        timeoutMs={1000}
        onClose={() => {
          setIsToastOpen(false);
        }}
      >
        발송한 초대장은 24시간 이후 만료됩니다.
      </Toast>
    </>
  );

  return useObserver(() => (
    <ProfileModal
      visible={visible}
      mask={isCreated}
      maskClosable={!isCreated}
      onCancel={onCancel}
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
            shape="round"
            onClick={() => handleSettingDialogOpen('2')}
          >
            설정
          </SettingButton>
          <SettingBar />
          <SettingButton type="text" shape="round" onClick={handleOpenSupport}>
            고객지원
          </SettingButton>
        </UserSettingArea>
      }
      transitionName=""
      maskTransitionName=""
      style={{ top: '2.875rem', margin: '0 20px 0 auto' }}
    />
  ));
};

const UserImage = styled.img`
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
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
    padding: 0 0.375rem;
    font-size: 0.75rem;
    color: #cacdff;
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
    width: 13.94rem;
    color: #7b869a;
    background-color: transparent;
    border-color: #7b869a;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      border-color: #7b869a;
      color: #fff;
    }
    &:active,
    &:focus {
      background-color: #6c56e5;
      border-color: #6c56e5;
      color: #fff;
    }
  }
`;
const UserSpaceArea = styled.div`
  position: relative;
  padding: 0.625rem 0.5rem 1rem 0.875rem;
  background-color: #f2f2f2;
  border-radius: 0 0 0.625rem 0.625rem;
  ${props =>
    !props.isEdit &&
    css`
      &:before {
        content: '';
        position: absolute;
        top: -3.125rem;
        left: 0;
        right: 0;
        height: 3.125rem;
        background-color: #f2f2f2;
      }
    `};
`;
const DataName = styled.p`
  margin-bottom: 0.5rem;
  font-size: 0.63rem;
  color: #777;
`;
const DataBox = styled.div`
  display: flex;
  align-items: center;
  .ant-btn {
    background-color: transparent;
    &:hover {
      background-color: #dcddff;
    }
  }
  .ant-btn-circle {
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    background-size: 1rem 1rem;
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
  width: 2.375rem;
  height: 2.375rem;
  font-size: 1.125rem;
  line-height: 2.375rem;
  font-weight: 500;
  border-radius: 0.5rem;
`;
const Info = styled.p`
  overflow: hidden;
  flex: 1;
  margin: 0 0.625rem;
  font-size: 0.6875rem;
  color: #777;
  line-height: 0.8125rem;
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
  &:hover {
    background-color: #dcddff;
    text-decoration: none;
  }
  &:active,
  &:focus {
    background-color: #bcbeff;
    svg {
      color: #43434a;
    }
  }
`;
const LinkIcon = styled.span`
  margin-right: 0.625rem;
  line-height: 0;
  color: #75757f;
  svg {
    width: 1.25rem;
    height: 1.25rem;
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
  left: -11.5rem;
  width: 11rem;
  top: 16.06rem;
  border: 1px solid #c6ced6;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
  background-color: #fff;
  z-index: 1050;
`;
const ConvertNow = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0.6875rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid #e3e7eb;
  & + div {
    border-top: 0;
  }
`;
const LogoSmall = styled(Logo)`
  width: 1.875rem;
  height: 1.875rem;
  font-size: 0.875rem;
  line-height: 1.875rem;
  ${props =>
    props.checked &&
    css`
      line-height: 1.625rem;
      border: 2px solid #5a5fff;
    `}
`;
const NowInfo = styled(Info)`
  margin: 0 0.375rem;
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
  padding: 0.625rem 0;
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
`;
const ItemText = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
`;
const ConvertAdd = styled.div`
  margin: 0 0.6875rem;
  padding: 0.5rem 0;
  border-top: 1px solid #e3e7eb;
`;
const AddButton = styled.a`
  display: inline-block;
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: #000;
  &:hover {
    color: #000;
  }
  span {
    color: #6c56e5 !important;
  }
`;
const UserSettingArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 0;
  border-top: 1px solid #e3e7eb;
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
  background-color: #686868;
  border-radius: 50%;
`;

export default ProfileMyModal;

import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Button, Modal, Avatar, Dropdown, Menu, Checkbox } from 'antd';
import { useCoreStores } from 'teespace-core';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SettingDialog from '../usersettings/SettingDialog';
import { useProfileContext } from './ProfileContextProvider';
import ProfileSpaceModal from './ProfileSpaceModal';
import convertSpaceIcon from '../../assets/convert space.svg';
import moreSpaceIcon from '../../assets/view_more.svg';
import checkekIcon from '../../assets/ts_check.svg';
import { ReactComponent as ArrowRightIcon } from '../../assets/arrow_right_line.svg';
import { ReactComponent as LangSpaceIcon } from '../../assets/plan_standard.svg';
import { ReactComponent as SquareSpaceIcon } from '../../assets/thumbnail.svg';

const ProfileInfoModal = ({ userId, thumbPhoto }) => {
  const { userStore, authStore } = useCoreStores();
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const [itemKey, setItemKey] = useState('2');
  const [dropdownTop, setDropdownTop] = useState(null);
  const [settingDialogVisible, setSettingDialogVisible] = useState(false);
  const [spaceListVisible, setSpaceListVisible] = useState(false);
  const [lngListVisible, setLngListVisible] = useState(false);
  const useProfile = useProfileContext();
  const spaceRef = useRef();
  const topRef = useRef();
  const { i18n } = useTranslation();

  const handleSettingDialogOpen = useCallback(
    e => {
      setItemKey(e);
      useProfile.setState({
        ...useProfile.state,
        infoMode: false,
        created: false,
      });
      setSettingDialogVisible(true);
      setSpaceListVisible(false);
    },
    [useProfile],
  );

  const handleSettingDialogClose = useCallback(() => {
    setSettingDialogVisible(false);
  }, []);

  const handleInfoClose = useCallback(() => {
    useProfile.setState({
      ...useProfile.state,
      infoMode: false,
      created: false,
    });
    setLngListVisible(false);
  }, [useProfile]);

  const toggleEditMode = useCallback(
    e => {
      if (typeof e === 'boolean')
        useProfile.setState({ ...useProfile.state, infoMode: !e, editMode: e });
      else
        useProfile.setState({
          ...useProfile.state,
          infoMode: false,
          editMode: true,
        });
      setSpaceListVisible(false);
    },
    [useProfile],
  );

  const handleSpaceList = useCallback(() => {
    setSpaceListVisible(spaceListVisible => !spaceListVisible);
    useProfile.setState({ ...useProfile.state, created: false });
  }, [useProfile]);

  const handleSwitchSpace = useCallback(() => {
    console.log('select space');
    setSpaceListVisible(false);
  }, []);

  const handleLogout = async () => {
    await authStore.logout({});
    history.push(`/login`);
  };

  const revokeURL = useCallback(() => {
    URL.revokeObjectURL(thumbPhoto);
  }, [thumbPhoto]);

  const handleToggleLngList = useCallback(() => {
    setLngListVisible(l => !l);
    useProfile.setState({ ...useProfile.state, created: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useProfile]);

  const handleLanguage = useCallback(lng => {
    setLngListVisible(l => false);
    i18n.changeLanguage(lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInviteDialog = useCallback(() => {
    console.log('InviteDialog');
  }, []);

  const handleMemberList = useCallback(() => {
    console.log('MemberList');
  }, []);

  const handleSpaceEditDialog = useCallback(() => {
    console.log('MemberList');
  }, []);

  const handleAdminPage = useCallback(() => {
    history.push('/admin');
  }, []);

  useEffect(() => {
    (async () => {
      const userProfile = await userStore.getProfile({ userId });
      setProfile(userProfile);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore]);

  useEffect(() => {
    if (spaceRef.current && topRef.current) {
      setDropdownTop(
        spaceRef.current.getBoundingClientRect().top -
          topRef.current.getBoundingClientRect().top,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceRef.current, topRef.current]);

  useEffect(() => {
    // ProfileContext의 state를 추가로 초기화(Dim 처리 및 추후 추가 될 값에 반응가능)
    if (useProfile.state.created)
      useProfile.setState({
        ...useProfile.state,
        infoMode: true,
        isAdmin: true,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 이후 '현재 스페이스의 어드민'인지를 체크하도록 수정
  const moreMenu = (
    <Menu style={{ minWidth: '6.25rem' }}>
      <Menu.Item onClick={handleInviteDialog}>구성원 초대</Menu.Item>
      <Menu.Item onClick={handleMemberList}>구성원 목록</Menu.Item>
      {useProfile.state.isAdmin && (
        <Menu.Item onClick={handleSpaceEditDialog}>스페이스 편집</Menu.Item>
      )}
      {useProfile.state.isAdmin && (
        <Menu.Item onClick={handleAdminPage}>어드민 페이지</Menu.Item>
      )}
    </Menu>
  );

  const ConvertLists = [
    '다른 스페이스 이름',
    '다른 스페이스 이름2',
    '다른 스페이스 이름3',
    '다른 스페이스 이름4',
    '다른 스페이스 이름5',
  ];

  return (
    <ProfileModal
      visible={useProfile.state.infoMode}
      mask={useProfile.state.created}
      maskClosable
      onCancel={handleInfoClose}
      title={null}
      closable={false}
      footer={null}
      transitionName=""
      maskTransitionName=""
      width="17rem"
      style={{ top: '2.875rem' }}
    >
      <UserArea ref={topRef}>
        <UserImage src={thumbPhoto} onLoad={revokeURL} />
        <UserName>{profile?.name}</UserName>
        <UserMail>{`(${profile?.email})`}</UserMail>
        <UserButtonBox>
          <Button type="link" onClick={toggleEditMode}>
            프로필 편집
          </Button>
          <UserBar />
          <Button type="link" onClick={handleSettingDialogOpen.bind(this, '6')}>
            비밀번호 변경
          </Button>
        </UserButtonBox>
        <LogoutButton shape="round" onClick={handleLogout}>
          로그아웃
        </LogoutButton>
      </UserArea>
      <UserSpaceArea>
        <DataName>현재 스페이스</DataName>
        <DataBox ref={spaceRef}>
          <Logo
            shape="square"
            style={{ color: '#fff', backgroundColor: '#75757F' }}
          >
            U
          </Logo>
          <Info>
            <Title>UX팀</Title>
            tmax-ux.wapl.ai
          </Info>
          <Button
            type="circle"
            className="btn-convert"
            onClick={handleSpaceList}
          >
            <Blind>스페이스 전환</Blind>
          </Button>
          <Dropdown overlay={moreMenu} placement="bottomRight">
            <Button type="circle" className="btn-more">
              <Blind>설정</Blind>
            </Button>
          </Dropdown>
        </DataBox>
      </UserSpaceArea>
      <UserSubArea>
        <SubInfo tabIndex="-1">
          <LinkIcon>
            <SquareSpaceIcon />
          </LinkIcon>
          스페이스 목록으로 이동
        </SubInfo>
      </UserSubArea>
      <UserSubArea>
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
      </UserSubArea>
      <UserSettingArea>
        <SettingButton
          type="text"
          shape="round"
          onClick={handleSettingDialogOpen.bind(this, '2')}
        >
          설정
        </SettingButton>
        <SettingBar />
        <SettingButton type="text" shape="round">
          고객지원
        </SettingButton>
      </UserSettingArea>
      {spaceListVisible && (
        <ConvertDropdown pos={dropdownTop}>
          <ConvertNow>
            <LogoSmall
              shape="square"
              checked
              style={{ color: '#fff', backgroundColor: '#75757F' }}
            >
              U
            </LogoSmall>
            <NowInfo>
              <NowTitle>UX팀</NowTitle>
              현재 스페이스입니다.
            </NowInfo>
            <Checkbox checked className="check-round" />
          </ConvertNow>
          <ConvertList>
            {ConvertLists.map(i => (
              <ConvertItem onClick={handleSwitchSpace} key={i}>
                <LogoSmall
                  shape="square"
                  style={{ color: '#fff', backgroundColor: '#75757F' }}
                >
                  U
                </LogoSmall>
                <ItemText>{i}</ItemText>
              </ConvertItem>
            ))}
          </ConvertList>
          <ConvertAdd>
            <AddButton href="#">
              <span>+</span> 새 스페이스 생성
            </AddButton>
          </ConvertAdd>
        </ConvertDropdown>
      )}
      {useProfile.state.created && (
        <ProfileSpaceModal
          oneButton={useProfile.state.isAdmin}
          userName={profile?.name}
        />
      )}
      <SettingDialog
        selectedKeyA={itemKey}
        visible={settingDialogVisible}
        onCancel={handleSettingDialogClose}
      />
    </ProfileModal>
  );
};
const ProfileModal = styled(Modal)`
  margin: 0 20px 0 auto;
  .ant-modal-content {
    border: 1px solid #c6ced6;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
    border-radius: 0.25rem;
  }
  .ant-modal-body {
    padding: 0;
  }
`;
const UserArea = styled.div`
  position: relative;
  padding: 1.25rem 1.5rem 0.9375rem;
  background-color: #0b1d41;
  border-radius: 0.1875rem 0.1875rem 1.875rem 1.875rem;
  font-size: 0.75rem;
  color: #fff;
  text-align: center;
  z-index: 5;
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
const UserImage = styled.img`
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 50%;
`;
const UserName = styled.p`
  margin-top: 0.5rem;
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.25rem;
`;
const UserMail = styled.span`
  margin-top: 0.13rem;
  font-size: 0.69rem;
  opacity: 0.8;
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
const UserBar = styled.span`
  display: inline-block;
  width: 1px;
  height: 0.81rem;
  margin: 0 0.375rem;
  opacity: 0.6;
  background: #fff;
`;
const UserSpaceArea = styled.div`
  position: relative;
  padding: 0.625rem 0.5rem 1rem 0.875rem;
  background-color: #f2f2f2;
  border-radius: 0 0 0.625rem 0.625rem;
  &:before {
    content: '';
    position: absolute;
    top: -3.125rem;
    left: 0;
    right: 0;
    height: 3.125rem;
    background-color: #f2f2f2;
  }
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
const LangIcon = styled.span`
  margin-left: auto;
  line-height: 0;
  svg {
    width: 1rem;
    height: 1rem;
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
const SettingBar = styled.span`
  display: inline-block;
  width: 0.1875rem;
  height: 0.1875rem;
  margin: 0 0.375rem;
  background-color: #686868;
  border-radius: 50%;
`;
const ConvertDropdown = styled.div`
  position: absolute;
  left: -11.5rem;
  width: 11rem;
  top: ${props => (props.pos ? `${props.pos}px` : '0px')};
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
const LngList = styled.ul`
  position: absolute;
  left: -5.25rem;
  width: 5.19rem;
  margin-top: -3.25rem;
  padding: 0.25rem 0;
  background-color: #fff;
  border: 1px solid #c6ced6;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
`;
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

export default ProfileInfoModal;

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Tabs } from 'antd';
import styled from 'styled-components';
import { EventBus, useCoreStores } from 'teespace-core';
import { Talk } from 'teespace-talk-app';
import { NoteApp, NoteIcon } from 'teespace-note-app';
import { CalendarApp, CalendarIcon } from 'teespace-calendar-app';
import { MailMainView, MailSideView, MailSubView } from 'teespace-mail-app';
import { DriveApp, DriveIcon, ViewFileIcon } from 'teespace-drive-app';
import { queryStringToObject } from '../libs/utils';
import Profile from '../components/Profile';
import RoomList from '../components/RoomList';
import FriendLnb from '../components/friends/FriendsLNB';
import Splitter from '../components/Splitter';
import mailIcon from '../assets/icon_lnb_mail.svg';
import chatIcon from '../assets/icon_lnb_chatting.svg';
import friendIcon from '../assets/icon_lnb_friend.svg';
import './mainPage.css';
import CommonButton from '../components/commons/Button';
import SettingDialog from '../components/Usersettings/SettingDialog';
import { useStore } from '../stores';

const { TabPane } = Tabs;

function MainPage() {
  const params = useParams();
  const history = useHistory();
  const [tab, setTab] = useState(null);
  const [id, setId] = useState(null);
  const [mainApp, setMainApp] = useState(null);
  const [subApp, setSubApp] = useState(null);
  const [layoutState, setLayoutState] = useState('close');
  const { uiStore } = useStore();

  // URL 에 따른 State 변경
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(history.location.search);
    const subAppQuery = urlSearchParams.get('sub');

    setTab(params.tab);
    setId(params.id);
    setMainApp(params.mainApp);
    setSubApp(subAppQuery);

    if (subAppQuery) {
      if (layoutState === 'close') setLayoutState('collapse');
    } else {
      setLayoutState('close');
    }
  }, [params, history, layoutState]);

  // Event 핸들러 등록
  useEffect(() => {
    const fullHandleId = EventBus.on('onLayoutFull', () => {
      setLayoutState('full');
    });
    const expandHandleId = EventBus.on('onLayoutExpand', () => {
      setLayoutState('expand');
    });
    const collapseHandleId = EventBus.on('onLayoutCollapse', () => {
      setLayoutState('collapse');
    });
    const closeHandleId = EventBus.on('onLayoutClose', () => {
      setLayoutState('close');
      history.push({
        pathname: history.location.pathname,
        search: null,
      });
    });

    const changeQueryStringHandler = EventBus.on(
      'onChangeQueryString',
      queryObj => {
        history.push({
          pathname: history.location.pathname,
          search: queryObj
            ? Object.entries(queryObj)
                .map(e => e.join('='))
                .join('&')
            : null,
        });
      },
    );

    return function cleanUp() {
      EventBus.off('onLayoutFull', fullHandleId);
      EventBus.off('onLayoutExpand', expandHandleId);
      EventBus.off('onLayoutCollapse', collapseHandleId);
      EventBus.off('onLayoutClose', closeHandleId);
      EventBus.off('onChangeQueryString', changeQueryStringHandler);
    };
  }, [history]);

  // RoomId, layoutState 가 바뀌면 다시 그려야 한다. getAppComponent 를 다시 메모이제이션 한다.
  const getAppComponent = useCallback(
    appName => {
      switch (appName) {
        case 'profile':
          return <Profile userId={id} editMode={false} isVertical={false} />;
        case 'talk':
          return null;
        // return <Talk layoutState={layoutState} roomId={id} />;
        case 'note':
          return <NoteApp layoutState={layoutState} roomId={id} />;
        case 'schedule':
          return <CalendarApp layoutState={layoutState} roomId={id} />;
        case 'drive':
          return <DriveApp layoutState={layoutState} roomId={id} />;
        case 'plus':
          return <DriveApp layoutState={layoutState} roomId={id} />;
        case 'mail':
          return (
            <MailMainView
              queryString={queryStringToObject(
                history.location.search?.substring(1),
              )}
              layoutState={layoutState}
              roomId={id}
            />
          );
        case 'mailsub':
          return (
            <MailSubView
              queryString={queryStringToObject(
                history.location.search?.substring(1),
              )}
              layoutState={layoutState}
              roomId={id}
            />
          );
        default:
          return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, layoutState, history.location.search],
  );

  // Room ID 가 바뀌면, getAppComponent가 변경(새로 생성) 되므로, mainApplication 또는 subApplication을 다시 메모이제이션 한다.
  // 별개로, mainApp / subApp state가 변경 되었을 때도, mainApplication 또는 subApplication을 다시 메모이제이션 한다.
  const mainApplication = useMemo(() => {
    return getAppComponent(mainApp);
  }, [getAppComponent, mainApp]);

  const subApplication = useMemo(() => {
    return getAppComponent(subApp);
  }, [getAppComponent, subApp]);

  const handleSettingDialogOpen = () => {
    uiStore.showSettingDialog();
  };

  return (
    <AppLayout>
      <LeftSide>
        <Tabs animated={false}>
          <TabPane
            key="f"
            tab={
              <img src={friendIcon} alt="friends" style={{ width: '40px' }} />
            }
          >
            <FriendLnb />
          </TabPane>

          <TabPane
            key="s"
            tab={<img src={chatIcon} alt="chat" style={{ width: '40px' }} />}
          >
            <RoomList />
          </TabPane>

          <TabPane
            key="m"
            tab={<img src={mailIcon} alt="mail" style={{ width: '30px' }} />}
          >
            <MailSideView
              queryString={queryStringToObject(
                history.location.search?.substring(1),
              )}
              layoutState={layoutState}
            />
          </TabPane>
        </Tabs>
      </LeftSide>
      <MainSide>
        <Header>
          <Title>{tab === 's' && <span>Room Header</span>}</Title>
          <AppIconContainer>
            <NoteIcon
              width={24}
              height={24}
              state={subApp === 'note' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: `?sub=note`,
                });
              }}
            />
            <DriveIcon
              width={24}
              height={24}
              state={subApp === 'drive' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: `?sub=drive`,
                });
              }}
            />
            <CalendarIcon
              width={24}
              height={24}
              state={subApp === 'schedule' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: `?sub=schedule`,
                });
              }}
            />
            <ViewFileIcon
              width={24}
              height={24}
              state={subApp === 'plus' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: `?sub=plus`,
                });
              }}
            />
          </AppIconContainer>
          <UserMenu>
            <CommonButton onClick={handleSettingDialogOpen}>
              Profile 영역 (고정)
            </CommonButton>
            <SettingDialog />
          </UserMenu>
        </Header>
        <AppContainer>
          <Splitter
            sizes={[75, 25]}
            minSize={400}
            gutterSize={10}
            layoutState={layoutState}
          >
            <MainAppContainer>{mainApplication}</MainAppContainer>
            <SubAppContainer>{subApplication}</SubAppContainer>
          </Splitter>
        </AppContainer>
      </MainSide>
    </AppLayout>
  );
}

const AppLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const LeftSide = styled.div`
  display: flex;
  height: 100%;
  width: 260px;
  border-right: 1px solid #dddddd;
`;

const Header = styled.div`
  display: flex;
  height: 60px;
  align-items: center;
  border-bottom: 1px solid #dddddd;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  flex: auto;
  height: 100%;
  border-right: 1px solid #dddddd;
`;

const AppIconContainer = styled.div`
  display: flex;
  align-items: center;
  border-right: 1px solid #dddddd;
  height: 40px;
  padding: 0 15px;
`;

const UserMenu = styled.div`
  padding: 0 10px;
`;

const MainSide = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 260px);
  height: 100%;
`;

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 60px);
`;
const MainAppContainer = styled.div`
  display: flex;
  flex: auto;
  overflow: hidden;
`;

const SubAppContainer = styled.div`
  display: flex;
  flex: auto;
  overflow: hidden;
  background: white;
`;

export default MainPage;

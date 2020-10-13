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
import Profile from '../components/Profile';
import { useStore } from '../stores';
import RoomList from '../components/RoomList';
import FriendLnb from '../components/friends/FriendsLNB';
import Splitter from '../components/Splitter';
import mailIcon from '../assets/icon_lnb_mail.svg';
import chatIcon from '../assets/icon_lnb_chatting.svg';
import friendIcon from '../assets/icon_lnb_friend.svg';
import './mainPage.css';

const { TabPane } = Tabs;

const DEFAULT_MAIN_APP = 'talk';

function MainPage() {
  const params = useParams();
  const history = useHistory();
  const [tab, setTab] = useState(null);
  const [id, setId] = useState(null);
  const [mainApp, setMainApp] = useState(null);
  const [subApp, setSubApp] = useState(null);
  const [layoutState, setLayoutState] = useState('close');
  const { authStore } = useCoreStores();
  const { roomStore } = useStore();

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

  // const getRooms = async () => {
  //   await roomStore.getRooms(authStore.myInfo.id);
  //   history.push({
  //     pathname: `/s/${roomStore.rooms?.[0]?.id}/${DEFAULT_MAIN_APP}`,
  //     search: history.location.search,
  //   });
  // };

  // // ROOM 가져오기
  // useEffect(() => {
  //   if (tab === 's') {
  //     (async () => {
  //       await getRooms();
  //     })();
  //   }
  // }, [tab]);

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

    return function cleanUp() {
      EventBus.off('onLayoutFull', fullHandleId);
      EventBus.off('onLayoutExpand', expandHandleId);
      EventBus.off('onLayoutCollapse', collapseHandleId);
      EventBus.off('onLayoutClose', closeHandleId);
    };
  }, [history]);

  // RoomId, layoutState 가 바뀌면 다시 그려야 한다. getAppComponent 를 다시 메모이제이션 한다.
  const getAppComponent = useCallback(
    appName => {
      console.log('LAYOUT STATE : ', layoutState);
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
          return <MailMainView layoutState={layoutState} roomId={id} />;
        default:
          return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, layoutState],
  );

  // Room ID 가 바뀌면, getAppComponent가 변경(새로 생성) 되므로, mainApplication 또는 subApplication을 다시 메모이제이션 한다.
  // 별개로, mainApp / subApp state가 변경 되었을 때도, mainApplication 또는 subApplication을 다시 메모이제이션 한다.
  const mainApplication = useMemo(() => {
    return getAppComponent(mainApp);
  }, [getAppComponent, mainApp]);

  const subApplication = useMemo(() => {
    return getAppComponent(subApp);
  }, [getAppComponent, subApp]);

  const handleTabClick = key => {
    let pathname = null;
    let search = null;
    switch (key) {
      /* friend : /f/:id 형식 (query string, app 정보 없음) */
      case 'f':
        pathname = `/${key}/${authStore.myInfo.id}/profile`;
        search = null;
        break;
      /* space, mail : /f/:id/:app?sub... 형식  */
      case 's':
        pathname = `/${key}/${roomStore.rooms?.[0]?.id}/${DEFAULT_MAIN_APP}`;
        search = history.location.search;
        break;
      /* mail 누르면 sub 앱 없어져야 하나? 정책 결정 필요 */
      case 'm':
        pathname = `/${key}/${id}/mail`;
        search = null;
        break;
      default:
        break;
    }
    history.push({
      pathname,
      search,
    });
  };

  return (
    <AppLayout>
      <LeftSide>
        <Tabs activeKey={tab} onTabClick={handleTabClick} animated={false}>
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
            <RoomList rooms={roomStore.rooms} />
          </TabPane>

          <TabPane
            key="m"
            tab={<img src={mailIcon} alt="mail" style={{ width: '30px' }} />}
          >
            <MailSideView />
          </TabPane>
        </Tabs>
      </LeftSide>
      <MainSide>
        <Header>
          <Title>Title 영역 (icon container에 따라 가변)</Title>
          <AppIconContainer>
            <NoteIcon
              width={50}
              height={50}
              state={subApp === 'note' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: `?sub=note`,
                });
              }}
            />
            <DriveIcon
              width={50}
              height={50}
              state={subApp === 'drive' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: `?sub=drive`,
                });
              }}
            />
            <CalendarIcon
              width={50}
              height={50}
              state={subApp === 'schedule' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: `?sub=schedule`,
                });
              }}
            />
            <ViewFileIcon
              width={50}
              height={50}
              state={subApp === 'plus' ? 'active' : 'default'}
              onClick={() => {
                history.push({
                  pathname: history.location.pathname,
                  search: `?sub=plus`,
                });
              }}
            />
          </AppIconContainer>
          <UserMenu>Profile 영역 (고정)</UserMenu>
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

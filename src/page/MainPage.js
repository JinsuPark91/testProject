import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useOpenInWindow } from 'use-open-window';
import { Tabs } from 'antd';
import styled from 'styled-components';
import { useCoreStores, EventBus, WWMS } from 'teespace-core';
import { Talk } from 'teespace-talk-app';
import { NoteApp, NoteIcon } from 'teespace-note-app';
import { CalendarApp, CalendarIcon } from 'teespace-calendar-app';
import { MailMainView, MailSideView, MailSubView } from 'teespace-mail-app';
import { DriveApp, DriveIcon, ViewFileIcon } from 'teespace-drive-app';
import Splitter from '../components/Splitter';
import mailIcon from '../assets/icon_lnb_mail.svg';
import chatIcon from '../assets/icon_lnb_chatting.svg';
import friendIcon from '../assets/icon_lnb_friend.svg';
import './mainPage.css';

const { TabPane } = Tabs;

const DEFAULT_MAIN_APP = 'talk';

function MainPage() {
  const { authStore } = useCoreStores();
  const params = useParams();
  const history = useHistory();
  const [tabType, setTabType] = useState(null);
  const [mainApp, setMainApp] = useState(null);
  const [subApp, setSubApp] = useState(null);
  const [layoutState, setLayoutState] = useState('close');
  const [isNewWindow, setIsNewWindow] = useState(false);

  // NEW WINDOW TEST
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

  // NEW WINDOW TEST
  const [handleNoteWindowOpen, newNoteWindowHandler] = useOpenInWindow(
    `${window.location.origin}/s/1234/note?mini=true`,
    {
      name: '_blank',
      centered: true,
      specs: {
        width: 1024,
        height: 768,
      },
    },
  );

  // console.log(params);
  // console.log(history);
  useEffect(() => {
    WWMS.setConfig({
      url: `${process.env.REACT_APP_WEBSOCKET_URL}?USER_ID=${authStore.myInfo.id}&action=&CONNECTION_ID=undefined`,
      isDebug: true,

      useInterval: false,
      intervalTime: 1000,

      useReconnect: true,
      reconnectInterval: 2000,

      intervalFunction: () => {
        console.log('send ping.');
      },

      onopen: null,
      onerror: null,
      onmessage: null,
      onclose: null,
    });

    WWMS.addHandler('CHN0001', msg => {
      console.log('WWMS received : ', msg);
    });

    WWMS.connect();
  }, []);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(history.location.search);
    const subAppQuery = urlSearchParams.get('sub');
    setIsNewWindow(urlSearchParams.has('mini'));

    setTabType(params['0']);
    setMainApp(params.mainApp);
    setSubApp(subAppQuery);
    if (subAppQuery) {
      if (layoutState === 'close') setLayoutState('collapse');
    } else {
      setLayoutState('close');
    }
  }, [params, history, layoutState]);

  useEffect(() => {
    const fullHandleId = EventBus.on('onLayoutFull', param => {
      setLayoutState('full');
    });
    const expandHandleId = EventBus.on('onLayoutExpand', param => {
      setLayoutState('expand');
    });
    const collapseHandleId = EventBus.on('onLayoutCollapse', param => {
      setLayoutState('collapse');
    });
    const closeHandleId = EventBus.on('onLayoutClose', param => {
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
  }, []);

  const renderApp = app => {
    switch (app) {
      case 'profile':
        // TODO : Profile Component 받기.
        return <Profile />;
      case 'talk':
        return <Talk layoutState={layoutState} />;
      case 'note':
        return <NoteApp layoutState={layoutState} />;
      case 'schedule':
        return <CalendarApp layoutState={layoutState} />;
      case 'drive':
        return <DriveApp layoutState={layoutState} />;
      case 'plus':
        return <DriveApp layoutState={layoutState} />;
      case 'mail':
        return <MailMainView layoutState={layoutState} />;
      case 'office':
        // TODO : Office Component 받기.
        return null;
      case 'Meeting':
        // TODO : Meeting Component 받기.
        return null;
      default:
        return null;
    }
  };

  const handleTabClick = key => {
    let pathname = null;
    let search = null;
    switch (key) {
      /* friend : /f/:id 형식 (query string, app 정보 없음) */
      case 'f':
        pathname = `/${key}/${params.id}/profile`;
        search = null;
        break;
      /* space, mail : /f/:id/:app?sub... 형식  */
      case 's':
        pathname = `/${key}/${params.id}/${DEFAULT_MAIN_APP}`;
        search = history.location.search;
        break;
      /* mail 누르면 sub 앱 없어져야 하나? 정책 결정 필요 */
      case 'm':
        pathname = `/${key}/${params.id}/mail`;
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
      {!isNewWindow ? (
        <>
          <LeftSide>
            <Tabs activeKey={tabType} onTabClick={handleTabClick}>
              <TabPane
                key="f"
                tab={
                  <img
                    src={friendIcon}
                    alt="friends"
                    style={{ width: '40px' }}
                  />
                }
              >
                <FriendLnb />
              </TabPane>

              <TabPane
                key="s"
                tab={
                  <img src={chatIcon} alt="chat" style={{ width: '40px' }} />
                }
              >
                <SpaceLnb />
              </TabPane>

              <TabPane
                key="m"
                tab={
                  <img src={mailIcon} alt="mail" style={{ width: '30px' }} />
                }
              >
                <MailSideView />
              </TabPane>
            </Tabs>
          </LeftSide>
          <MainSide>
            <Header>
              <Title>
                Title 영역 (icon container에 따라 가변)
                <button
                  type="button"
                  onClick={() => {
                    console.log(handleTalkWindowOpen());
                  }}
                >
                  Talk 새창
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log(handleNoteWindowOpen());
                  }}
                >
                  Note 새창
                </button>
              </Title>
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
                <MainAppContainer>{renderApp(mainApp)}</MainAppContainer>
                <SubAppContainer>{renderApp(subApp)}</SubAppContainer>
              </Splitter>
            </AppContainer>
          </MainSide>
        </>
      ) : (
        renderApp(mainApp)
      )}
    </AppLayout>
  );
}

const FriendLnb = () => {
  return <div>Friend LNB</div>;
};

const Profile = ({ userId }) => {
  return <div>{`${userId}의 profile`}</div>;
};

const SpaceLnb = () => {
  return <div>Space LNB</div>;
};

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

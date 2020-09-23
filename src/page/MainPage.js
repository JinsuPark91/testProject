import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Tabs } from 'antd';
import styled from 'styled-components';
import { useCoreStores, EventBus } from 'teespace-core';
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
const eventBus = new EventBus();

function MainPage() {
  const { authStore } = useCoreStores();
  const params = useParams();
  const history = useHistory();
  const [tabType, setTabType] = useState(null);
  const [mainApp, setMainApp] = useState(null);
  const [subApp, setSubApp] = useState(null);
  const [layoutState, setLayoutState] = useState('close');

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(history.location.search);
    const subAppQuery = urlSearchParams.get('sub');

    setTabType(params['0']);
    setMainApp(params.mainApp);
    setSubApp(subAppQuery);
    console.log('SUB APP : ', subAppQuery);
    console.log('layout state : ', layoutState);
    if (subAppQuery) {
      if (layoutState === 'close') setLayoutState('collapse');
    } else {
      setLayoutState('close');
    }
  }, [params, history, layoutState]);

  useEffect(() => {
    const fullHandleId = eventBus.on('onLayoutFull', param => {
      setLayoutState('full');
    });
    const expandHandleId = eventBus.on('onLayoutExpand', param => {
      setLayoutState('expand');
    });
    const collapseHandleId = eventBus.on('onLayoutCollapse', param => {
      setLayoutState('collapse');
    });
    const closeHandleId = eventBus.on('onLayoutClose', param => {
      setLayoutState('close');
      history.push({
        pathname: history.location.pathname,
        search: null,
      });
    });

    return function cleanUp() {
      eventBus.off('onLayoutFull', fullHandleId);
      eventBus.off('onLayoutExpand', expandHandleId);
      eventBus.off('onLayoutCollapse', collapseHandleId);
      eventBus.off('onLayoutClose', closeHandleId);
    };
  }, []);

  const renderApp = isMainApp => {
    const targetApp = isMainApp ? mainApp : subApp;

    switch (targetApp) {
      case 'talk':
        return <Talk />;
      case 'note':
        return <NoteApp />;
      case 'schedule':
        return <CalendarApp />;
      case 'drive':
        return <DriveApp />;
      case 'plus':
        return <DriveApp />;
      case 'office':
        return null;
      case 'mail':
        return <MailMainView />;
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
        pathname = `/${key}/${params.id}`;
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
      <LeftSide>
        <Tabs activeKey={tabType} onTabClick={handleTabClick}>
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
            <SpaceLnb />
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
          <Title>
            Title 영역 (icon container에 따라 가변)
            <button
              type="button"
              onClick={() => {
                eventBus.dispatch('onLayoutFull', {
                  isMaximize: true,

                  callback: param => {
                    console.log('NOTE: onLayoutFull callback : ', param);
                  },
                });
              }}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => {
                eventBus.dispatch('onLayoutExpand', {
                  isMaximize: true,

                  callback: param => {
                    console.log('NOTE: onLayoutFull callback : ', param);
                  },
                });
              }}
            >
              확장
            </button>
            <button
              type="button"
              onClick={() => {
                eventBus.dispatch('onLayoutCollapse', {
                  isMaximize: true,

                  callback: param => {
                    console.log('NOTE: onLayoutCollapse callback : ', param);
                  },
                });
              }}
            >
              축소
            </button>
            <button
              type="button"
              onClick={() => {
                eventBus.dispatch('onLayoutClose', {
                  isMaximize: true,

                  callback: param => {
                    console.log('NOTE: onLayoutClose callback : ', param);
                  },
                });
              }}
            >
              닫기
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
          <Profile>Profile 영역 (고정)</Profile>
        </Header>
        <AppContainer>
          <Splitter
            sizes={[75, 25]}
            minSize={400}
            gutterSize={10}
            layoutState={layoutState}
          >
            <MainAppContainer>{renderApp(true)}</MainAppContainer>
            <SubAppContainer>{renderApp(false)}</SubAppContainer>
          </Splitter>
        </AppContainer>
      </MainSide>
    </AppLayout>
  );
}

const FriendLnb = () => {
  return <div>Friend LNB</div>;
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
  width: 300px;
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

const Profile = styled.div`
  padding: 0 10px;
`;

const MainSide = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 300px);
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

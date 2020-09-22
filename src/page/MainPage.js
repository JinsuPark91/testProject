import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Tabs, Button } from 'antd';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import { Talk } from 'teespace-talk-app';
import { NoteApp, NoteIcon } from 'teespace-note-app';
import { CalendarApp } from 'teespace-calendar-app';
import { MailMainView, MailSideView, MailSubView } from 'teespace-mail-app';
import { DriveApp, DriveIcon } from 'teespace-drive-app';
import Splitter from '../components/Splitter';
import './mainPage.css';

const { TabPane } = Tabs;

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
  width: 60px;
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
`;

const DEFAULT_MAIN_APP = 'talk';

function MainPage() {
  const { authStore } = useCoreStores();
  const params = useParams();
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const urlSearchParams = new URLSearchParams(history.location.search);
  const [mainApp, setMainApp] = useState(null);
  const [subApp, setSubApp] = useState(null);
  const [layoutState, setLayoutState] = useState('collapse');

  console.log(params);
  console.log(history);
  console.log(routeMatch);

  // subApp useEffect
  useEffect(() => {
    setSubApp(urlSearchParams.get('sub'));
  }, [urlSearchParams]);

  // mainApp useEffect
  useEffect(() => {
    setMainApp(params.mainApp);
  }, [params.mainApp]);

  const doLogout = useCallback(async () => {
    await authStore.logout();
    history.push('/login');
  }, [authStore, history]);

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
      case 'office':
        return <Office />;
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
        <Tabs onTabClick={handleTabClick}>
          <TabPane
            key="f"
            tab={
              <img
                src="/LNB_people_list.svg"
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
              <img
                src="/LNB_chatting.svg"
                alt="chat"
                style={{ width: '40px' }}
              />
            }
          >
            <SpaceLnb />
          </TabPane>

          <TabPane
            key="m"
            tab={
              <img src="/LNB_mail.svg" alt="mail" style={{ width: '30px' }} />
            }
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
          </AppIconContainer>
          <Profile>Profile 영역 (고정)</Profile>
        </Header>
        <AppContainer>
          <Splitter
            sizes={[75, 25]}
            minSize={400}
            expandToMin={false}
            gutterSize={5}
            gutterAlign="center"
            snapOffset={10}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
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

const MailLnb = () => {
  return <div>Mail LNB</div>;
};

const Mail = () => {
  return <div>Mail Content</div>;
};

const Calendar = () => {
  return (
    <div>
      Schedule App
      <input type="text" style={{ height: '30px' }} />
    </div>
  );
};

const Drive = () => {
  return (
    <div>
      Drive App
      <input type="text" style={{ height: '30px' }} />
    </div>
  );
};

const Office = () => {
  return (
    <div>
      Office App
      <input type="text" style={{ height: '30px' }} />
    </div>
  );
};

export default MainPage;

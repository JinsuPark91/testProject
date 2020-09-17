import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Tabs, Button } from 'antd';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
import Splitter from '../components/Splitter';
// import { TeeTalk } from 'teespace-talk-app';
// import { NoteApp } from 'teespace-note-app';
// import { CalendarApp } from 'teespace-calendar-app';
const { TabPane } = Tabs;

const AppLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const LeftSide = styled.div`
  display: flex;
  height: 100%;
  flex: 0 0 300px;
`;

const Header = styled.div`
  height: 60px;
  background: yellow;
`;

const MainSide = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

const AppContainer = styled.div`
  display: flex;
  flex: 1;
`;
const MainAppContainer = styled.div`
  display: flex;
  flex: auto;
  background: gray;
`;

const SubAppContainer = styled.div`
  display: flex;
  flex: auto;
  background: skyblue;
`;

const Lnb = styled.div`
  display: flex;
  flex: 0 0 300px;
  background: orange;
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
  const [rootUrlType, setRootUrlType] = useState(null);
  const [layoutState, setLayoutState] = useState('collapse');

  console.log(params);
  console.log(history);
  console.log(routeMatch);

  // subApp useEffect
  useEffect(() => {
    setSubApp(urlSearchParams.get('sub'));
  }, [history.location.search]);

  // mainApp useEffect
  useEffect(() => {
    setMainApp(params.mainApp);
  }, [params.mainApp]);

  // mainApp useEffect
  useEffect(() => {
    setRootUrlType(params['0']);
  }, [params['0']]);

  const doLogout = useCallback(async () => {
    await authStore.logout();
    history.push('/login');
  }, [authStore, history]);

  const renderApp = isMainApp => {
    const targetApp = isMainApp ? mainApp : subApp;
    switch (targetApp) {
      case 'talk':
        return <Talk />;
      case 'schedule':
        return <Calendar />;
      case 'drive':
        return <Drive />;
      case 'office':
        return <Office />;
      case 'mail':
        return <Mail />;
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
          <TabPane key="f" tab="Friend">
            <FriendLnb />
          </TabPane>

          <TabPane key="s" tab="Space">
            <SpaceLnb />
          </TabPane>

          <TabPane key="m" tab="Mail">
            <MailLnb />
          </TabPane>
        </Tabs>
      </LeftSide>
      <MainSide>
        <Header>
          <Button
            type="button"
            onClick={() => {
              history.push({
                pathname: `/${params['0']}/${params.id}/${params.mainApp}`,
                search: '?sub=schedule',
              });
            }}
          >
            서브 스케줄
          </Button>
          <Button
            type="button"
            onClick={() => {
              history.push({
                pathname: `/${params['0']}/${params.id}/${params.mainApp}`,
                search: '?sub=office',
              });
            }}
          >
            서브 오피스
          </Button>
          <Button
            type="button"
            onClick={() => {
              history.push({
                pathname: `/${params['0']}/${params.id}/drive`,
                search: history.location.search,
              });
            }}
          >
            메인 드라이브
          </Button>
          <Button
            type="button"
            onClick={() => {
              history.push({
                pathname: `/${params['0']}/${params.id}/talk`,
                search: history.location.search,
              });
            }}
          >
            메인 토크
          </Button>
          <Button
            type="button"
            onClick={() => {
              history.push({
                pathname: `/${params['0']}/${params.id}/mail`,
                search: history.location.search,
              });
            }}
          >
            메인 메일
          </Button>

          <Button
            type="button"
            onClick={() => {
              setLayoutState('full');
            }}
          >
            전체
          </Button>

          <Button
            type="button"
            onClick={() => {
              setLayoutState('expand');
            }}
          >
            확장
          </Button>

          <Button
            type="button"
            onClick={() => {
              setLayoutState('collapse');
            }}
          >
            축소
          </Button>

          <Button
            type="button"
            onClick={() => {
              setLayoutState('close');
            }}
          >
            닫기
          </Button>
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

const Talk = () => {
  return (
    <div>
      Talk App
      <input type="text" style={{ height: '30px' }} />
    </div>
  );
};

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

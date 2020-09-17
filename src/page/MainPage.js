import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Tabs, Button } from 'antd';
import styled from 'styled-components';
import { useCoreStores } from 'teespace-core';
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

function MainPage() {
  const { authStore } = useCoreStores();
  const params = useParams();
  const history = useHistory();
  const routeMatch = useRouteMatch();
  const urlSearchParams = new URLSearchParams(history.location.search);
  const [mainApp, setMainApp] = useState(params.mainApp);
  const [subApp, setSubApp] = useState(null);

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
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <LeftSide>
        <Tabs>
          <TabPane key="1" tab="Friend">
            <FriendLnb />
          </TabPane>
          <TabPane key="2" tab="Space">
            <SpaceLnb />
          </TabPane>
          <TabPane key="3" tab="Mail">
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
        </Header>
        <AppContainer>
          <MainAppContainer>{renderApp(true)}</MainAppContainer>
          <SubAppContainer>{renderApp(false)}</SubAppContainer>
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

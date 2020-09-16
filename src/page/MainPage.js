import React, { useCallback, useState } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Tabs, Button } from 'antd';
import styled from 'styled-components';
import Split from 'react-split';
import { useCoreStores } from 'teespace-core';
import { TeeTalk } from 'teespace-talk-app';
// import { NoteApp } from 'teespace-note-app';
// import { CalendarApp } from 'teespace-calendar-app';

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  flex: 0 0 60px;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`;

const Tab = styled.div`
  display: flex;
  flex: 0 0 300px;
  background: green;
`;

const Title = styled.div`
  display: flex;
  flex: auto;
  background: yellow;
`;

const AppSplitView = styled(Split)`
  display: flex;
  height: 100%;
  flex: auto;
  & .gutter {
    border-right: 1px solid #e3e7eb;
  }
  & .gutter:hover {
    cursor: ew-resize;
  }
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
  const [layoutState, setLayoutState] = useState('collapse');
  console.log('Params : ', params);
  console.log('History : ', history);
  console.log('RouteMatch : ', routeMatch);

  const doLogout = useCallback(async () => {
    await authStore.logout();
    history.push('/login');
  }, [authStore, history]);

  const renderContent = () => {
    switch (layoutState) {
      case 'full':
        return <SubAppContainer>subapp</SubAppContainer>;
        break;
      case 'expand':
        return (
          <>
            <Lnb></Lnb>
            <SubAppContainer>subapp</SubAppContainer>
          </>
        );
        break;
      case 'collapse':
        return (
          <>
            <Lnb></Lnb>
            <AppSplitView
              sizes={[75, 25]}
              minSize={400}
              expandToMin={false}
              gutterSize={5}
              gutterAlign="center"
              snapOffset={10}
              dragInterval={1}
              direction="horizontal"
              cursor="col-resize"
            >
              <MainAppContainer>mainapp</MainAppContainer>
              <SubAppContainer>subapp</SubAppContainer>
            </AppSplitView>
          </>
        );
        break;
      case 'close':
        return (
          <>
            <Lnb></Lnb>
            <MainAppContainer>mainapp</MainAppContainer>
          </>
        );
        break;
    }
  };

  return (
    <AppLayout>
      <Header>
        <Tab></Tab>
        <Title>
          <button
            onClick={() => {
              setLayoutState('full');
            }}
          >
            전체
          </button>
          <button
            onClick={() => {
              setLayoutState('expand');
            }}
          >
            확장
          </button>
          <button
            onClick={() => {
              setLayoutState('collapse');
            }}
          >
            축소
          </button>
          <button
            onClick={() => {
              setLayoutState('close');
            }}
          >
            닫기
          </button>
        </Title>
      </Header>
      <Content>{renderContent()}</Content>
    </AppLayout>
  );
}

export default MainPage;

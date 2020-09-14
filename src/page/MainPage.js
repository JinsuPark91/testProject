import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Tabs, Button } from 'antd';
import styled from 'styled-components';
import Split from 'react-split';
import { useCoreStores } from 'teespace-core';

const AppLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Header = styled.div`
  display: flex;
  height: 60px;
`;

const LeftSide = styled.div`
  width: 300px;
  height: 100%;
  flex-shrink: 0;
`;

const MainSide = styled.div`
  flex: 1;
`;

const AppSplitView = styled(Split)`
  height: 100%;
  display: flex;
  & .gutter {
    border-right: 1px solid #e3e7eb;
  }
  & .gutter:hover {
    cursor: ew-resize;
  }
`;

function MainPage() {
  const { authStore } = useCoreStores();
  const { id, mainApp } = useParams();
  const history = useHistory();

  const doLogout = useCallback(async () => {
    await authStore.logout();
    history.push('/login');
  }, [authStore, history]);

  return (
    <AppLayout>
      <LeftSide>
        <Header>Tab Area</Header>
        LNB
      </LeftSide>
      <MainSide>
        <AppSplitView
          sizes={[75, 25]}
          minSize={400}
          expandToMin={false}
          gutterSize={3}
          gutterAlign="center"
          snapOffset={10}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
        >
          <div>
            <Header>Header</Header>
            Main App Area
          </div>
          <div>
            <Header>
              <Button onClick={doLogout}>Logout</Button>
            </Header>
            Sub App Area
          </div>
        </AppSplitView>
      </MainSide>
    </AppLayout>
  );
}

export default MainPage;

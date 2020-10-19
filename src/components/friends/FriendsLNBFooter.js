import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout, Row, Col } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'teespace-core';
import AddFriendsDialog from './AddFriendsDialog';
import { useStore } from '../../stores';

const { Footer } = Layout;

const FooterWrapper = styled(Footer)`
  background-color: transparent;
  padding: 14px 20px;
`;
function FriendsLNBFooter() {
  const { uiStore } = useStore();

  const showAddFrieldsDialog = useCallback(() => {
    uiStore.showAddFriendsDialog();
  }, [uiStore]);

  return useObserver(() => (
    <FooterWrapper>
      <Row>
        <Col align="center" span={24}>
          <Button
            type="outlined"
            onClick={showAddFrieldsDialog}
            style={{ width: '100%' }}
          >
            <DownloadOutlined />
            프렌즈 추가
          </Button>
          <AddFriendsDialog
            visible={uiStore.visibleAddFriendsDialog}
            width={uiStore.addFriendsDialogInfo.width}
            height={uiStore.addFriendsDialogInfo.height}
          />
        </Col>
      </Row>
    </FooterWrapper>
  ));
}

export default FriendsLNBFooter;

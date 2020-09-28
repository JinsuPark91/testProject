import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout, Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import AddFriendsDialog from './AddFriendsDialog';
import { useStore } from '../../stores';

const { Footer } = Layout;

const FooterWrapper = styled(Footer)`
  background-color: transparent;
`;
function FriendsLNBFooter() {
  const { uiStore } = useStore();

  const showAddFrieldsDialog = useCallback(() => {
    uiStore.showAddFriendsDialog();
  }, [uiStore]);

  return useObserver(() => (
    <FooterWrapper>
      <Row>
        <Col align="center" span="24">
          <Button
            type="primary"
            shape="round"
            icon={<DownloadOutlined />}
            onClick={showAddFrieldsDialog}
            size="20"
          >
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

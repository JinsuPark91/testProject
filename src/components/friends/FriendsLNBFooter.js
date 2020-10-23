import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { Layout, Row, Col } from 'antd';
import { Button } from 'teespace-core';
import AddFriendsDialog from './AddFriendsDialog';
import { useStore } from '../../stores';
import SpaceIconImg from '../../assets/ts_space.svg';

const { Footer } = Layout;

const FooterWrapper = styled(Footer)`
  background-color: transparent;
  padding: 14px 20px;
`;
const StyleIcon = styled.i`
  width: 18px;
  height: 18px;
  display:inline-block;
  background: url('${SpaceIconImg}') 0 0 no-repeat;
  vertical-align: middle;
  & + span {
    margin-left: 3px;
  }
`;
const FriendButton = styled(Button)`
&.ant-btn-outlined {
  width: 100%;
  height: auto !important;
  font-size: 0.8125rem;
  color: #5a5fff;
  line-height: 1rem;
  padding: 9px 0 8px;
  border-radius: 21px;
  border: 1px solid #5a5fff;
  span {
    vertical-align: middle;
  }
}
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
          <FriendButton
            type="outlined"
            onClick={showAddFrieldsDialog}
          >
            <StyleIcon/>
            프렌즈 추가
          </FriendButton>
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

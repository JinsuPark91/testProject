import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Dialog, Tabs, TabPane } from 'teespace-core';
import AddFriendsByOrganization from './AddFriendsByOrganization';
import AddFriendsByPhoneNumber from './AddFriendsByPhoneNumber';
import AddFriendsByEmail from './AddFriendsByEmail';
import AddFriendsByRecommendataion from './AddFriendsByRecommendation';
import AddFriendsByInvitation from './AddFriendsByInvitation';
import { useStore } from '../../stores';

const Wrapper = styled.div`
  min-height: 420px;
  max-height: 700px;
  overflow: auto;
`;
const StyledTabPane = styled(TabPane)`
  height: 100%;
  overflow: auto;
  padding: 16px;
`;

/**
 * 친구 추가 다이얼로그
 * @param {Object} props
 * @param {boolean} props.visible
 */
function AddFriendsDialog({ visible }) {
  const { uiStore } = useStore();

  const handleCancelClick = useCallback(() => {
    uiStore.hideAddFriendsDialog();
  }, [uiStore]);

  return (
    <Dialog
      title="프렌즈 추가"
      size="medium"
      onCancel={handleCancelClick}
      visible={visible}
      footer={null}
    >
      <Wrapper>
        <Tabs style={{ height: '100%' }}>
          <StyledTabPane tab="조직도 조회" key="1">
            <AddFriendsByOrganization />
          </StyledTabPane>
          <StyledTabPane tab="연락처로 추가" key="2">
            <AddFriendsByPhoneNumber />
          </StyledTabPane>
          <StyledTabPane tab="아이디 검색" key="3">
            <AddFriendsByEmail />
          </StyledTabPane>
          <StyledTabPane tab="추천 프렌즈" key="4">
            <AddFriendsByRecommendataion />
          </StyledTabPane>
          <StyledTabPane tab="초대장 보내기" key="5">
            <AddFriendsByInvitation />
          </StyledTabPane>
        </Tabs>
      </Wrapper>
    </Dialog>
  );
}

export default AddFriendsDialog;

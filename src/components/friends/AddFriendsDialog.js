import React, { useRef, useCallback } from 'react';
import { useObserver } from 'mobx-react';
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
  padding: 1rem;
`;

/**
 * 친구 추가 다이얼로그
 * @param {Object} props
 * @param {boolean} props.visible
 */
function AddFriendsDialog({ visible }) {
  const { uiStore } = useStore();
  const timestamp = useRef(Date.now());

  const handleCancelClick = useCallback(() => {
    uiStore.hideAddFriendsDialog();
  }, [uiStore]);

  const handleTabKeyChange = useCallback(
    tabKey => {
      uiStore.changeAddFriendsDialogTabKey(tabKey);
      if (tabKey === 'organization') {
        timestamp.current = Date.now();
      }
    },
    [uiStore],
  );

  return useObserver(() => (
    <Dialog
      title="프렌즈 추가"
      size="medium"
      onCancel={handleCancelClick}
      visible={visible}
      footer={null}
    >
      <Wrapper>
        <Tabs
          style={{ height: '100%' }}
          activeKey={uiStore.addFriendsDialogTabKey}
          onChange={handleTabKeyChange}
        >
          <StyledTabPane tab="조직도 조회" key="organization">
            <AddFriendsByOrganization timestamp={timestamp.current} />
          </StyledTabPane>
          <StyledTabPane tab="연락처로 추가" key="phone">
            <AddFriendsByPhoneNumber />
          </StyledTabPane>
          <StyledTabPane tab="아이디 검색" key="id">
            <AddFriendsByEmail />
          </StyledTabPane>
          <StyledTabPane tab="추천 프렌즈" key="recommended">
            <AddFriendsByRecommendataion />
          </StyledTabPane>
          <StyledTabPane tab="초대장 보내기" key="invitation">
            <AddFriendsByInvitation />
          </StyledTabPane>
        </Tabs>
      </Wrapper>
    </Dialog>
  ));
}

export default AddFriendsDialog;

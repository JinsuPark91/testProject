import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Tabs } from 'antd';
import AddFriendsByOrganization from './AddFriendsByOrganization';
import AddFriendsByPhoneNumber from './AddFriendsByPhoneNumber';
import AddFriendsByEmail from './AddFriendsByEmail';
import AddFriendsByRecommendataion from './AddFriendsByRecommendation';
import AddFriendsByInvitation from './AddFriendsByInvitation';
import { useStore } from '../../stores';
import CommonDialog from '../commons/Dialog';
import CommonTabs from '../commons/Tabs';

const { TabPane } = Tabs;

const Wrapper = styled.div`
  height: calc(100vh - 2.69rem) !important;
  max-height: 31.75rem;
`;
const StyledTabPane = styled(TabPane)`
  height: '100%';
  padding: 16px;
`;

/**
 * 친구 추가 다이얼로그
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {number} props.width - dialog width
 * @param {number} props.height - dialog height
 */
function AddFriendsDialog({ visible, width, height }) {
  const { uiStore } = useStore();

  const handleCancelClick = useCallback(() => {
    uiStore.hideAddFriendsDialog();
  }, [uiStore]);

  return (
    <CommonDialog
      title="프렌즈 추가"
      size="medium"
      onCancel={handleCancelClick}
      visible={visible}
      width={width}
      footer={null}
    >
      <Wrapper>
        <CommonTabs style={{ height: '100%' }}>
          <StyledTabPane tab="조직도 조회" key="1">
            <AddFriendsByOrganization />
          </StyledTabPane>
          {/* <StyledTabPane tab="연락처로 추가" key="2">
          <AddFriendsByPhoneNumber />
        </StyledTabPane> */}
          <StyledTabPane tab="아이디 검색" key="3">
            <AddFriendsByEmail />
          </StyledTabPane>
          {/* <StyledTabPane tab="추천 프렌즈" key="4">
          <AddFriendsByRecommendataion />
        </StyledTabPane>
        <StyledTabPane tab="초대장 보내기" key="5">
          <AddFriendsByInvitation />
        </StyledTabPane> */}
        </CommonTabs>
      </Wrapper>
    </CommonDialog>
  );
}

export default AddFriendsDialog;

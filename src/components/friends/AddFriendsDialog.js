import React, { useCallback } from 'react';
import { Modal, Tabs } from 'antd';
import AddFriendsByOrganization from './AddFriendsByOrganization';
import AddFriendsByPhoneNumber from './AddFriendsByPhoneNumber';
import AddFriendsByEmail from './AddFriendsByEmail';
import AddFriendsByRecommendataion from './AddFriendsByRecommendation';
import AddFriendsByInvitation from './AddFriendsByInvitation';
import { useStore } from '../../stores';

const { TabPane } = Tabs;

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

  const tabPaneStyle = {
    height: '100%',
  };

  return (
    <Modal
      title="프렌즈 추가"
      onCancel={handleCancelClick}
      visible={visible}
      width={width}
      bodyStyle={{ height }}
      footer={null}
    >
      <Tabs style={{ height: '100%' }}>
        <TabPane tab="조직도 조회" key="1" style={tabPaneStyle}>
          <AddFriendsByOrganization />
        </TabPane>
        <TabPane tab="연락처로 추가" key="2" style={tabPaneStyle}>
          <AddFriendsByPhoneNumber />
        </TabPane>
        <TabPane tab="아이디 검색" key="3" style={tabPaneStyle}>
          <AddFriendsByEmail />
        </TabPane>
        <TabPane tab="추천 프렌즈" key="4" style={tabPaneStyle}>
          <AddFriendsByRecommendataion />
        </TabPane>
        <TabPane tab="초대장 보내기" key="5" style={tabPaneStyle}>
          <AddFriendsByInvitation />
        </TabPane>
      </Tabs>
    </Modal>
  );
}

export default AddFriendsDialog;

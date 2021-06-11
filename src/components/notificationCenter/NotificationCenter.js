import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useCoreStores, Tabs } from 'teespace-core';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import NotificationList from './NotificationList';

const { TabPane } = Tabs;

const NotificationCenter = ({ visible, onClose }) => {
  const { notificationStore } = useCoreStores();

  useEffect(() => {
    // fetchMentions();
    // fetchHistories();
  }, []);

  const handleTabChange = key => {
    notificationStore.tabKey = key;
  };

  return (
    <StyledModal
      width="fit-content"
      closable
      style={{ top: '3.755rem', right: '0.625rem', position: 'absolute' }}
      visible={visible}
      footer={null}
      mask={false}
      onCancel={onClose}
    >
      <Wrapper>
        <Tabs defaultActiveKey="mention" onChange={handleTabChange}>
          <TabPane tab="멘션" key="mention">
            <Observer>
              {() => (
                <NotificationList
                  items={notificationStore.mentions}
                  hasMore={notificationStore.mention.hasMore}
                  isLoading={notificationStore.mention.isLoading}
                  loadMore={() => {
                    console.log('Fetch More Function');
                  }}
                />
              )}
            </Observer>
          </TabPane>
          <TabPane tab="히스토리" key="history">
            <Observer>
              {() => (
                <NotificationList
                  items={notificationStore.histories}
                  hasMore={notificationStore.history.hasMore}
                  isLoading={notificationStore.history.isLoading}
                  loadMore={() => {
                    console.log('Fetch More Function');
                  }}
                />
              )}
            </Observer>
          </TabPane>
        </Tabs>
      </Wrapper>
    </StyledModal>
  );
};

export default NotificationCenter;

const StyledModal = styled(Modal)`
  & .ant-modal-body {
    padding: 0;
  }

  & .ant-modal-close {
    display: none;
  }
`;

const Wrapper = styled.div`
  width: 22.375rem;
`;

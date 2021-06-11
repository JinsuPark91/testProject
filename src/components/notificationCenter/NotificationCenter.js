import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useCoreStores, Tabs } from 'teespace-core';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import NotificationList from './NotificationList';

const { TabPane } = Tabs;

const MASK_CLASS_NAME = 'modal-mask';

const NotificationCenter = ({ visible, onClose }) => {
  const { notificationStore } = useCoreStores();

  useEffect(() => {
    // fetchMentions();
    // fetchHistories();
  }, []);

  const handleTabChange = key => {
    notificationStore.tabKey = key;
  };

  const handleClose = e => {
    if (e.target.className.includes(MASK_CLASS_NAME)) onClose();
  };

  return (
    <Mask className={MASK_CLASS_NAME} visible={visible} onClick={handleClose}>
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
    </Mask>
  );
};

export default NotificationCenter;

const Mask = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 6;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`;

const Wrapper = styled.div`
  width: 22.375rem;
  position: fixed;
  top: 3.755rem;
  right: 0.625rem;
  z-index: 7;
  background: #fff;
  border-radius: 0.25rem;
  border: 1px solid #ddd9d4;
`;

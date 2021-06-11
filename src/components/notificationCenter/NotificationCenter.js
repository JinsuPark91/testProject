import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { useCoreStores, Tabs } from 'teespace-core';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import NotificationList from './NotificationList';

const { TabPane } = Tabs;

const MASK_CLASS_NAME = 'modal-mask';

const NotificationCenter = ({ visible, onClose }) => {
  const { t } = useTranslation();
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

  const Tab = ({ title, unreadCount }) => (
    <TabWrapper>
      <div>{title}</div>
      {unreadCount ? (
        <TabUnreadCount>
          {unreadCount > 99 ? '99+' : unreadCount}
        </TabUnreadCount>
      ) : null}
    </TabWrapper>
  );

  return (
    <Mask className={MASK_CLASS_NAME} visible={visible} onClick={handleClose}>
      <Wrapper>
        <Tabs defaultActiveKey="mention" onChange={handleTabChange}>
          <TabPane
            tab={
              <Observer>
                {() => (
                  <Tab
                    title={t('CM_NOTI_CENTER_01')}
                    unreadCount={notificationStore.mention.unreadCount}
                  />
                )}
              </Observer>
            }
            key="mention"
          >
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
          <TabPane
            tab={
              <Observer>
                {() => (
                  <Tab
                    title={t('CM_NOTI_CENTER_04')}
                    unreadCount={notificationStore.history.unreadCount}
                  />
                )}
              </Observer>
            }
            key="history"
          >
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

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabUnreadCount = styled.div`
  display: flex;
  flex: 0 0 1.625rem;
  height: 0.875rem;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  border-radius: 0.56rem;
  background: #dc4547;
  color: #fff;
  margin-left: 0.188rem;
`;

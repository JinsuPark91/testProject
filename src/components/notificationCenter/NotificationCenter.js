import React, { useEffect } from 'react';
import { useCoreStores, Tabs, Modal } from 'teespace-core';
import { Observer, useLocalStore } from 'mobx-react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import NotificationList from './NotificationList';

const { TabPane } = Tabs;

const LIMIT = 15;
const NotificationCenter = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { notificationStore } = useCoreStores();

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    notificationStore.fetchNotificationList({
      type: 'mention',
      offset: 0,
      limit: LIMIT,
    });
    notificationStore.fetchNotificationList({
      type: 'history',
      offset: 0,
      limit: LIMIT,
    });
  }, []);

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
    <StyledModal
      closable={false}
      mask={false}
      width="100%"
      visible={visible}
      onCancel={handleClose}
      footer={null}
      style={{ top: '3.7rem' }}
    >
      <Wrapper>
        <Tabs defaultActiveKey="mention">
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
                  type="mention"
                  items={notificationStore.mentions}
                  hasMore={notificationStore.mention.hasMore}
                  isLoading={notificationStore.mention.isLoading}
                  loadMore={() => {
                    notificationStore.fetchNotificationList({
                      type: 'mention',
                      offset: notificationStore.mentions.length,
                      limit: LIMIT,
                    });
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
                  type="history"
                  items={notificationStore.histories}
                  hasMore={notificationStore.history.hasMore}
                  isLoading={notificationStore.history.isLoading}
                  loadMore={() => {
                    notificationStore.fetchNotificationList({
                      type: 'history',
                      offset: notificationStore.histories.length,
                      limit: LIMIT,
                    });
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
  &.ant-modal {
    justify-content: flex-end;
  }
`;

const Wrapper = styled.div`
  width: 22.375rem;
  background: #fff;
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

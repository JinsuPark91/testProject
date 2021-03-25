/* eslint-disable no-underscore-dangle */
import React from 'react';
import styled from 'styled-components';
import { Observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useCoreStores } from 'teespace-core';
import { RoomSettingStore as store } from '../../stores/RoomSettingStore';
import SubMemberPage from './SubMemberPage';
import SubWaitingMemberPage from './SubWaitingMemberPage';
import SubBlockedMemberPage from './SubBlockedMemberPage';

const SubTab = ({ isOpenRoom = false }) => {
  const { t } = useTranslation();

  const handleTabChange = e => {
    store.changeSubTab(e.target.dataset.tabKey);
  };

  return (
    <div style={{ marginBottom: '2rem', marginLeft: '6.5rem' }}>
      <Observer>
        {() => (
          <SubTabItem
            data-tab-key="member"
            className={store.subTabKey === 'member' ? 'sub-tab--active' : ''}
            onClick={handleTabChange}
          >
            {t('CM_ROOM_SETTING_MANAGE_PEOPLE_01')}
          </SubTabItem>
        )}
      </Observer>
      <span
        style={{
          borderRight: '1px solid #D0CCC7',
          height: '0.75rem',
          margin: '0 0.63rem',
        }}
      />
      {/* {isOpenRoom ? (
        <>
          <Observer>
            {() => (
              <SubTabItem
                data-tab-key="waiting"
                className={
                  store.subTabKey === 'waiting' ? 'sub-tab--active' : ''
                }
                onClick={handleTabChange}
              >
                {t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_01')}
              </SubTabItem>
            )}
          </Observer>
          <span
            style={{
              borderRight: '1px solid #D0CCC7',
              height: '0.75rem',
              margin: '0 0.63rem',
            }}
          />
        </>
      ) : null} */}
      <Observer>
        {() => (
          <SubTabItem
            data-tab-key="blocked"
            className={store.subTabKey === 'blocked' ? 'sub-tab--active' : ''}
            onClick={handleTabChange}
          >
            {t('CM_ROOM_SETTING_BLOCK_MANAGE_PEOPLE_01')}
          </SubTabItem>
        )}
      </Observer>
    </div>
  );
};

const MemberSettingPage = ({ roomId }) => {
  const { roomStore } = useCoreStores();
  const roomInfo = roomStore.getRoom(roomId);

  const subPage = () => {
    switch (store.subTabKey) {
      case 'member':
        return <SubMemberPage roomId={roomId} />;
      case 'waiting':
        return <SubWaitingMemberPage roomId={roomId} />;
      case 'blocked':
        return <SubBlockedMemberPage roomId={roomId} />;
      default:
        return null;
    }
  };

  return (
    <Wrapper style={{ height: '100%', padding: '0 0.88rem 0.88rem 0.88rem' }}>
      <SubTab isOpenRoom={roomInfo.type === 'WKS0003'} />

      <Observer>{() => subPage()}</Observer>
    </Wrapper>
  );
};

export default MemberSettingPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SubTabItem = styled.span`
  font-size: 0.69rem;
  color: #828282;
  cursor: pointer;

  &.sub-tab--active {
    color: #205855;
    font-weight: 600;
  }
`;

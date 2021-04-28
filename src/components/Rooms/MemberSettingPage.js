/* eslint-disable no-underscore-dangle */
import React from 'react';
import styled from 'styled-components';
import { Observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useCoreStores } from 'teespace-core';
import { useStores } from '../../stores';
import SubMemberPage from './SubMemberPage';
import SubWaitingMemberPage from './SubWaitingMemberPage';
import SubBlockedMemberPage from './SubBlockedMemberPage';

const SubTab = ({ isOpenRoom = false }) => {
  const { t } = useTranslation();
  const { roomSettingStore: store } = useStores();

  const handleTabChange = e => {
    store.changeSubTab(e.target.dataset.tabKey);
  };

  return (
    <SubTabWrap>
      <Observer>
        {() => (
          <SubTabItem>
            <ItemText
              data-tab-key="member"
              className={store.subTabKey === 'member' ? 'sub-tab--active' : ''}
              onClick={handleTabChange}
            >
              {t('CM_ROOM_SETTING_MANAGE_PEOPLE_01')}
            </ItemText>
          </SubTabItem>
        )}
      </Observer>
      {/* {isOpenRoom ? (
        <>
          <Observer>
            {() => (
              // "alarm-badge" className 추가 시 알림 뱃지 노출
              <SubTabItem className="alarm-badge">
                <ItemText
                  data-tab-key="waiting"
                  className={
                    store.subTabKey === 'waiting' ? 'sub-tab--active' : ''
                  }
                  onClick={handleTabChange}
                >
                  {t('CM_ROOM_SETTING_REQUEST_MANAGE_PEOPLE_01')}
                </ItemText>
              </SubTabItem>
            )}
          </Observer>
        </>
      ) : null} */}
      <Observer>
        {() => (
          <SubTabItem>
            <ItemText
              data-tab-key="blocked"
              className={store.subTabKey === 'blocked' ? 'sub-tab--active' : ''}
              onClick={handleTabChange}
            >
              {t('CM_ROOM_SETTING_BLOCK_MANAGE_PEOPLE_01')}
            </ItemText>
          </SubTabItem>
        )}
      </Observer>
    </SubTabWrap>
  );
};

const MemberSettingPage = ({ roomId }) => {
  const { roomStore } = useCoreStores();
  const { roomSettingStore: store } = useStores();
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
    <Wrapper>
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
  height: 100%;
  padding: 0 0.75rem 1.25rem;
`;

const SubTabWrap = styled.ul`
  display: flex;
  align-items: center;
  margin: 0 0 2rem 6.25rem;
  padding-top: 0.25rem;
`;

const SubTabItem = styled.li`
  position: relative;

  & + &::before {
    content: '';
    display: inline-block;
    width: 1px;
    height: 0.75rem;
    margin: 0.25rem 0.75rem 0;
    background-color: #d0ccc7;
    vertical-align: top;
  }

  &.alarm-badge::after {
    content: '';
    position: absolute;
    top: 0;
    right: -0.4375rem;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: #dc4547;
  }
`;

const ItemText = styled.span`
  display: inline-block;
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #828282;
  cursor: pointer;

  &.sub-tab--active {
    color: #205855;
    font-weight: 600;
  }
`;

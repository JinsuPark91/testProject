import React from 'react';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { Switch } from 'antd';
import { useStores } from '../../../../stores';
import MobileOpenRoomOptionHeader from './MobileOpenRoomOptionHeader';
import Input from '../../../Input';

const RoomNameArea = React.memo(() => {
  const { t } = useTranslation();
  const { mobileStore } = useStores();

  const handleChange = value => mobileStore.setOpenRoomNameOption(value);

  return (
    <RoomWrapper>
      <div>{t('CM_CREATEROOM_PRIVATEROOM_13')}</div>
      <Observer>
        {() => (
          <Input
            maxLength={50}
            value={mobileStore.openRoomOption.roomName}
            onChange={handleChange}
            placeholder={t('CM_B2B_CREATE_ROOM_POPUP_FRIENDS_08')}
            style={{ margin: '0.3rem 0 1rem 0', padding: '0 0.63rem' }}
          />
        )}
      </Observer>
      <SubText>{t('CM_CREATE_OPEN_ROOM_04')}</SubText>
    </RoomWrapper>
  );
});

const AuthArea = React.memo(() => {
  const { t } = useTranslation();
  const { mobileStore } = useStores();

  const handleChange = value => mobileStore.setOpenRoomSecretOption(value);

  return (
    <>
      <ToggleArea>
        <span>{t('CM_ROOM_SETTING_BASIC_13')}</span>
        <Observer>
          {() => (
            <Switch
              checked={mobileStore.openRoomOption.secret}
              onChange={handleChange}
            />
          )}
        </Observer>
      </ToggleArea>
      <SubText>{t('CM_ROOM_SETTING_BASIC_14')}</SubText>
    </>
  );
});

const MobileOpenRoomOptionPage = () => {
  return (
    <>
      <MobileOpenRoomOptionHeader />
      <Wrapper>
        <RoomNameArea />
        <AuthArea />
      </Wrapper>
    </>
  );
};

export default MobileOpenRoomOptionPage;

const Wrapper = styled.div`
  padding: 1rem 1rem 0 1rem;
`;

const RoomWrapper = styled.div`
  padding-bottom: 0.63rem;
  border-bottom: 1px solid #ddd9d4;
`;

const SubText = styled.span`
  font-size: 0.75rem;
  color: #656565;
`;

const ToggleArea = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0 0.25rem 0;
`;

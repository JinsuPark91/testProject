import React from 'react';
import { useTranslation } from 'react-i18next';
import { Observer } from 'mobx-react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useStores } from '../../../../stores';
import {
  Header,
  HeaderText,
  ButtonBox,
  IconButton,
  TextButton,
} from '../../style/MobileHeaderStyle';
import { ArrowBackIcon } from '../../Icon';

const MobileOpenRoomOptionHeader = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { mobileStore } = useStores();

  const handleCancel = () => history.push(`/open`);

  const handleCreate = () => history.push(`/createopen`);

  return (
    <Header>
      <IconButtonBox onClick={handleCancel}>
        <IconButton type="ghost" icon={<ArrowBackIcon />} />
      </IconButtonBox>
      <OpenHeaderText>{t('CM_CREATE_OPEN_ROOM')}</OpenHeaderText>
      <IconButtonBox>
        <Observer>
          {() => (
            <CreateButton
              type="ghost"
              onClick={handleCreate}
              disabled={mobileStore.openRoomOption.roomName === ''}
            >
              {t('CM_CREATE_OPEN_ROOM_05')}
            </CreateButton>
          )}
        </Observer>
      </IconButtonBox>
    </Header>
  );
};

export default React.memo(MobileOpenRoomOptionHeader);

const IconButtonBox = styled(ButtonBox)`
  & ~ & {
    margin-left: auto;
  }
`;

const CreateButton = styled(TextButton)`
  font-size: 0.88rem;
  & span {
    color: ${props => (props.disabled ? '#cccccc' : '#205855')};
  }
`;

const OpenHeaderText = styled(HeaderText)`
  color: #232d3b;
`;

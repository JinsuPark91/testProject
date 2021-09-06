import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Header,
  ButtonBox,
  IconButton,
  HeaderText,
} from '../../style/MobileHeaderStyle';
import { ArrowBackIcon } from '../../Icon';

const MobileOpenRoomHeader = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const handleGoBack = () => history.push(`/room`);

  return (
    <Header>
      <ButtonBox onClick={handleGoBack}>
        <IconButton type="ghost" icon={<ArrowBackIcon />} />
      </ButtonBox>
      <HeaderText>{t('CM_OPEN_ROOM_HOME_01')}</HeaderText>
    </Header>
  );
};

export default MobileOpenRoomHeader;

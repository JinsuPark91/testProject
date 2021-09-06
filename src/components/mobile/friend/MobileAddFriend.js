import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { MobileMemberList } from 'teespace-core';
import styled from 'styled-components';
import { remToPixel } from '../../../utils/GeneralUtil';
import { ArrowBackIcon } from '../Icon';
import { Header, ButtonBox, IconButton } from '../style/MobileHeaderStyle';

const MobileAddFriend = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleCancel = () => history.push(`/friend`);

  // 3 + 0.76 + 0.76 + 1.88 + 3.25
  const otherHeight = remToPixel(9.57);
  const height = window.innerHeight - otherHeight;

  return (
    <>
      <AddFriendHeader>
        <ButtonBox onClick={handleCancel}>
          <IconButton type="ghost" icon={<ArrowBackIcon />} />
        </ButtonBox>
        <Title>{t('CM_ADD_PHOTO_FRIENDS')}</Title>
      </AddFriendHeader>
      <MobileMemberList height={height} isAddFriend withTab={false} />
    </>
  );
};

export default MobileAddFriend;

const AddFriendHeader = styled(Header)`
  height: 2.88rem;
`;

const Title = styled.h3`
  font-size: 1.13rem;
  line-height: 1.63rem;
  color: #205855;
`;

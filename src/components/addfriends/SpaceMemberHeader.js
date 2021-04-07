import React from 'react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const SpaceMemberHeader = ({ userCount }) => {
  const { t } = useTranslation();
  const { spaceStore } = useCoreStores();

  return (
    <StyledWrapper>
      <StyledSpaceName>{spaceStore.currentSpace?.name}</StyledSpaceName>
      <StyledUserCounter>
        {t('CM_PPL_NUMBER', { num: userCount })}
      </StyledUserCounter>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
`;

const StyledSpaceName = styled.span`
  display: flex;
  color: #000000;
  font-size: 0.75rem;
`;

const StyledUserCounter = styled.span`
  flex: 1;
  text-align: right;
  align-self: center;
  font-size: 0.75rem;
  color: #000000;
`;

export default SpaceMemberHeader;

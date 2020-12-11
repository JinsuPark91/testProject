import React, { useCallback, useState } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

const CorpArea = styled.div`
  margin: auto auto 1.25rem;
  display: flex;
  flex-direction: column;
`;
const FlexRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-btn {
    height: auto;
    padding: 0;
  }
`;
const Copyright = styled.p`
  font-size: 0.6875rem;
  color: #7c7c7c;
`;
const LineBar = styled.span`
  width: 1px;
  height: 12px;
  margin: auto 0.5rem;
  background-color: #7c7c7c;
`;

const TermsFooter = ({ isService }) => {
  return (
    <CorpArea>
      <FlexRow>
        <Button type="link">이용약관</Button>
        <LineBar />
        <Button type="link">개인정보처리방침</Button>
        <LineBar />
        <Button id="serviceInfo" type="link">
          서비스 소개
        </Button>
      </FlexRow>
      <Copyright>
        Copyright 2020. Tmax A&#38;C Corp. All Rights Reserved
      </Copyright>
    </CorpArea>
  );
};

export default TermsFooter;

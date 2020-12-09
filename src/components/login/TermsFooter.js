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
  flex-direction: row;
  align-items: center;
  text-align: center;
  .ant-btn {
    font-size: 0.75rem;
    color: #6c56e5;
    padding: 0;
    height: auto;
  }
`;
const Copyright = styled.p`
  font-size: 0.6875rem;
  color: #7c7c7c;
  letter-spacing: 0;
`;
const LineBar = styled.span`
  width: 1px;
  height: 12px;
  background-color: #7c7c7c;
  margin: auto 0.5rem;
  display: inline-block;
`;

const TermsFooter = ({ isService }) => {
  return (
    <CorpArea>
      <FlexRow>
        <Button type="text">이용약관</Button>
        <LineBar />
        <Button type="text">개인정보처리방침</Button>
        <LineBar />
        <Button id="serviceInfo" type="text">
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

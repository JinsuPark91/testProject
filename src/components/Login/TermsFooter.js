import React, { useCallback, useState } from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TermsFooter = ({ isService }) => {
  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `flex-end`,
        alignItems: `center`,
      }}
    >
      <FlexRow>
        <Button type="text">이용약관</Button>
        <div
          style={{
            width: '0.06rem',
            height: '0.75rem',
            border: '0.01rem solid',
          }}
        />
        <Button type="text">개인정보처리방침</Button>
        {isService && (
          <div
            style={{
              width: '0.06rem',
              height: '0.75rem',
              border: '0.01rem solid',
            }}
          />
        )}
        {isService && (
          <Button id="serviceInfo" type="text">
            서비스 소개
          </Button>
        )}
      </FlexRow>
      <div>Copyright 2020. Tmax A&C Corp. All Rights Reserved</div>
    </div>
  );
};

export default TermsFooter;

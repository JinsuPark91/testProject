import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import TmaxLogo from '../../assets/logo_footer_copyright.svg';
import MovePage from '../../utils/MovePage';

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

const Copyright = styled.div`
  display: flex;
  justify-content: center;
  font-size: 0.6875rem;
  color: #7c7c7c;

  & > img {
    width: 2.56rem;
    height: 0.88rem;
    margin-right: 0.63rem;
  }
`;

const LineBar = styled.span`
  width: 1px;
  height: 12px;
  margin: auto 0.5rem;
  background-color: #7c7c7c;
`;

const TermsFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <CorpArea>
      <FlexRow>
        <Button
          type="link"
          onClick={() => MovePage('term-and-conditions', true)}
        >
          이용약관
        </Button>
        <LineBar />
        <Button type="link" onClick={() => MovePage('privacy-policy', true)}>
          개인정보처리방침
        </Button>
      </FlexRow>
      <Copyright>
        <img alt="logo" src={TmaxLogo} />
        Copyright {currentYear}. Tmax A&#38;C Corp. All Rights Reserved.
      </Copyright>
    </CorpArea>
  );
};

export default TermsFooter;

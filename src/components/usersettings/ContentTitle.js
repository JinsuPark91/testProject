import React from 'react';
import styled from 'styled-components';

const Title = styled.p`
  strong {
    font-size: 1.25rem;
    line-height: 1.81rem;
    font-weight: 500;
  }
`;
const SubTitle = styled.span`
  display: block;
  margin-top: 0.38rem;
  font-size: 0.75rem;
  color: #8d8d8d;
  line-height: 1.13rem;
`;

function ContentTitle({ title, subTitle }) {
  return (
    <>
      <Title>
        <strong>{title}</strong>
      </Title>
      <SubTitle>
        {subTitle}
      </SubTitle>
    </>
  );
}

export default ContentTitle;

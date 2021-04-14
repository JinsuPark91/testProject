import React from 'react';
import {
  ContentTitleWrap,
  Title,
  SubTitle,
} from '../../styles/usersettings/ContentTitleStyle';

function ContentTitle({ title, subTitle }) {
  return (
    <ContentTitleWrap>
      <Title>
        <strong>{title}</strong>
      </Title>
      <SubTitle>{subTitle}</SubTitle>
    </ContentTitleWrap>
  );
}

export default ContentTitle;

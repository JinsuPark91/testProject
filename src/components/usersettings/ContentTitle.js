import React from 'react';
import {
  ContentTitleWrap,
  Title,
  SubTitle,
} from '../../styles/usersettings/ContentTitleStyle';

function ContentTitle({ title, subTitle, divider = true }) {
  return (
    <ContentTitleWrap divider={divider}>
      <Title>
        <strong>{title}</strong>
      </Title>
      <SubTitle>{subTitle}</SubTitle>
    </ContentTitleWrap>
  );
}

export default React.memo(ContentTitle);

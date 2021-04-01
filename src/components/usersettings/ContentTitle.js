import React from 'react';
import {
  Title,
  SubTitle,
  Blank,
} from '../../styles/usersettings/ContentTitleStyle';

function ContentTitle({ title, subTitle }) {
  return (
    <>
      <Title>
        <strong>{title}</strong>
      </Title>
      <SubTitle>{subTitle}</SubTitle>
      <Blank />
    </>
  );
}

export default ContentTitle;

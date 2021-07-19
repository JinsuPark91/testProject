import React from 'react';

import {
  ContentTitleWrap,
  TitleArea,
  Title,
  SubTitle,
  AttachmentArea,
} from '../../styles/usersettings/ContentTitleStyle';

function ContentTitle({ title, subTitle, divider = true, attachment = '' }) {
  return (
    <ContentTitleWrap divider={divider}>
      <TitleArea>
        <Title>
          <strong>{title}</strong>
        </Title>
        <SubTitle>{subTitle}</SubTitle>
      </TitleArea>
      {!!attachment && <AttachmentArea>{attachment}</AttachmentArea>}
    </ContentTitleWrap>
  );
}

export default React.memo(ContentTitle);

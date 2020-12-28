import React from 'react';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';
import MemberItem from './MemberItem';

const MemberListView = ({ members = [] }) => {
  return (
    <StyledWrapper>
      <List height={400} itemCount={members.length} itemSize={70} width="100%">
        {({ index, style }) => {
          return (
            <MemberItem
              key={members[index].id}
              memberInfo={members[index]}
              style={style}
            />
          );
        }}
      </List>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  max-height: 25.81rem;
`;

export default MemberListView;

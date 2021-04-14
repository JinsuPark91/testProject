import React from 'react';
import { useObserver } from 'mobx-react';
import styled from 'styled-components';
import { Divider } from 'antd';
import SpaceMemberHeader from './SpaceMemberHeader';
import AddFriendsItem from './AddFriendsItem';

const Wrapper = styled.div`
  width: 100%;
  padding: 0 0.94rem;
`;

const StyledDivider = styled(Divider)`
  margin: 0.23rem 0 0.63rem 0;
`;

const AddFriendsFromSpace = ({ spaceMembers, searchText, isViewMode }) => {
  const filteredUserList = spaceMembers.filter(elem =>
    elem.displayName.toLowerCase().includes(searchText.toLowerCase()),
  );

  return useObserver(() => (
    <Wrapper>
      <SpaceMemberHeader userCount={filteredUserList.length} />
      <StyledDivider />
      <AddFriendsItem
        friendAddList={filteredUserList}
        isViewMode={isViewMode}
      />
    </Wrapper>
  ));
};

export default AddFriendsFromSpace;

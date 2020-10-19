import React from 'react';
import { Divider } from 'antd';
import styled from 'styled-components';
import { Input } from 'teespace-core';
import OrganizationDropdown from './OrganizationDropdown';

const Wrapper = styled.div`
  margin: 0.38rem 0.75rem;
`;
const StyledDivider = styled(Divider)`
  margin: 0;
`;
function AddFriendsByOrganizationContent({
  orgList,
  onInputChange,
  onDropdownChange,
}) {
  return (
    <>
      <Wrapper>
        <Input
          placeholder="팀 이름, 조직원 이름 검색"
          style={{ width: '100%' }}
          onPressEnter={onInputChange}
        />
      </Wrapper>
      <StyledDivider />
      <Wrapper>
        <OrganizationDropdown
          orgList={orgList}
          handleChange={onDropdownChange}
        />
      </Wrapper>
    </>
  );
}

export default AddFriendsByOrganizationContent;

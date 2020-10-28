import React from 'react';
import { Divider } from 'antd';
import styled from 'styled-components';
import { Input } from 'teespace-core';
import OrganizationDropdown from './OrganizationDropdown';

const Wrapper = styled.div`
  display: flex;
  margin: 0.38rem 0.75rem;
`;
const StyledDivider = styled(Divider)`
  margin: 0;
`;

const UserCounter = styled.div`
  flex: 1;
  text-align: right;
  align-self: center;
`;
function AddFriendsByOrganizationHeader({
  orgList,
  orgUserSize,
  onInputChange,
  onDropdownChange,
  overwrittenValue,
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
          onChange={onDropdownChange}
          overwrittenValue={overwrittenValue}
        />
        <UserCounter>{orgUserSize}명</UserCounter>
      </Wrapper>
    </>
  );
}

export default AddFriendsByOrganizationHeader;

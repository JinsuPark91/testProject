import React, { useRef, useEffect } from 'react';
import { Divider } from 'antd';
import styled from 'styled-components';
import { Input } from 'teespace-core';
import OrganizationDropdown from './OrganizationDropdown';

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 0.63rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #eeedeb;
`;

const UserCounter = styled.div`
  flex: 1;
  text-align: right;
  align-self: center;
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.75rem;
`;

function AddFriendsByOrganizationHeader({
  orgList,
  orgUserSize,
  onDropdownChange,
  overwrittenValue,
  defaultValue,
  timestamp,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.state.value = '';
    }
  }, [timestamp]);
  return (
    <>
      {/* <Wrapper>
        <Input
          ref={inputRef}
          placeholder="팀 이름, 조직원 이름 검색"
          style={{ width: '100%' }}
          onPressEnter={onInputChange}
        />
      </Wrapper>
      <StyledDivider /> */}
      <Wrapper>
        <OrganizationDropdown
          orgList={orgList}
          onChange={onDropdownChange}
          overwrittenValue={overwrittenValue}
          defaultValue={defaultValue}
        />
        <UserCounter>{orgUserSize}명</UserCounter>
      </Wrapper>
    </>
  );
}

export default AddFriendsByOrganizationHeader;

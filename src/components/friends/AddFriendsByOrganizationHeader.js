import React from 'react';
import { Divider } from 'antd';
import styled from 'styled-components';
import OrganizationDropdown from './OrganizationDropdown';
import CommonInput from '../commons/Input';

const Wrapper = styled.div`
  margin: 0.38rem 0.75rem;
`;
const StyledDivider = styled(Divider)`
  margin: 0;
`;
function AddFriendsByOrganizationContent() {
  return (
    <>
      <Wrapper>
        <CommonInput
          placeholder="팀 이름, 조직원 이름 검색"
          style={{ width: '100%' }}
        />
      </Wrapper>
      <StyledDivider />
      <Wrapper>
        <OrganizationDropdown />
      </Wrapper>
    </>
  );
}

export default AddFriendsByOrganizationContent;

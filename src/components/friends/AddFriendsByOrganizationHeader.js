import React from 'react';
import OrganizationDropdown from './OrganizationDropdown';
import CommonInput from '../commons/Input';

function AddFriendsByOrganizationContent() {
  return (
    <>
      <CommonInput
        placeholder="팀 이름, 조직원 이름 검색"
        style={{ width: '100%' }}
      />
      <OrganizationDropdown />
    </>
  );
}

export default AddFriendsByOrganizationContent;

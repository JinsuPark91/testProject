import React from 'react';
import { Input } from 'antd';
import OrganizationDropdown from './OrganizationDropdown';

function AddFriendsByOrganizationContent() {
  return (
    <>
      <Input placeholder="팀 이름, 조직원 이름 검색" />
      <OrganizationDropdown />
    </>
  );
}

export default AddFriendsByOrganizationContent;

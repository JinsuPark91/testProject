import React, { useEffect, useState } from 'react';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import AddFriendsByOrganizationHeader from './AddFriendsByOrganizationHeader';
import AddFriendsItem from './AddFriendsItem';
import OrganizationDropdown from './OrganizationDropdown';

const Wrapper = styled.div`
  width: 100%;
  padding: 0 0.94rem;
`;

const AddFriendsByOrganization = ({ searchText, isViewMode }) => {
  const { orgStore, userStore } = useCoreStores();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDefaultValue, setDropdownDefaultValue] = useState('');

  const initInfo = {
    searchedUserList: [],
    dropdownDefaultValue: '',
    dropdownDisplayValue: '',
    selectedValue: '',
  };
  const [orgInfo, setOrgInfo] = useState(initInfo);

  // dropdown의 item을 클릭했을 때
  const handleDropdownChange = async value => {
    await orgStore.getOrgUserList(...value.split('_'));
    setOrgInfo({
      searchedUserList: orgStore.orgUserList,
      dropdownDisplayValue: '',
      selectedValue: value,
    });
  };

  const handleSearch = async () => {
    const userList = await userStore.searchUsersByKeyword({
      keyword: searchText,
    });
    // const { companyCode, departmentCode } = userList[0];
    const companyCode = userList.length > 0 ? 'All' : 'NULL';
    const departmentCode = userList.length > 0 ? 'All' : 'NULL';

    setOrgInfo({
      ...orgInfo,
      searchedUserList: userList,
      dropdownDisplayValue: OrganizationDropdown.valueCreator({
        companyCode,
        departmentCode,
      }),
    });
  };

  useEffect(() => {
    (async () => {
      if (!isOpen) {
        const { companyCode, departmentCode } = await orgStore.getOrgUserDept(
          userStore.myProfile.id,
        );
        const parsedValue = OrganizationDropdown.valueCreator({
          companyCode,
          departmentCode,
        });
        setDropdownDefaultValue(parsedValue);
        handleDropdownChange(parsedValue);
        setIsOpen(true);
      } else if (searchText === '') {
        setOrgInfo({
          ...orgInfo,
          searchedUserList: orgStore.userOrgUserList,
          dropdownDisplayValue: '',
        });
        // 검색 내용이 비워져 있는 경우 기존에 선택되었던 조직 목록으로 이동함.
        if (orgInfo.selectedValue) handleDropdownChange(orgInfo.selectedValue);
      } else handleSearch();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  if (!isOpen) return null;

  return (
    <Wrapper>
      <AddFriendsByOrganizationHeader
        orgUserSize={orgInfo.searchedUserList?.length}
        onDropdownChange={handleDropdownChange}
        overwrittenValue={orgInfo.dropdownDisplayValue}
        defaultValue={dropdownDefaultValue}
      />
      <AddFriendsItem
        friendAddList={orgInfo.searchedUserList}
        isViewMode={isViewMode}
      />
    </Wrapper>
  );
};

export default AddFriendsByOrganization;

import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
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
}) {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <OrganizationDropdown
        orgList={orgList}
        onChange={onDropdownChange}
        overwrittenValue={overwrittenValue}
        defaultValue={defaultValue}
      />
      <UserCounter>
        {t('CM_PPL_NUMBER', {
          num: orgUserSize,
        })}
      </UserCounter>
    </Wrapper>
  );
}

export default AddFriendsByOrganizationHeader;

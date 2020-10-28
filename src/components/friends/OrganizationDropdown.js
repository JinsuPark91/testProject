import React, { useState, useCallback, useEffect } from 'react';
import { useObserver } from 'mobx-react';
import { TreeSelect, useCoreStores } from 'teespace-core';

const valueCreator = org => `${org.companyCode}_${org.departmentCode}`;
/**
 *
 * @param {Object} props
 * @param {function} props.onChange - ("[ companyCode, departmentCode ]") => {} 형태로 온다. JSON.parse 해서 store 파라미터로 던지면 됨.
 * @param {Array<OrgModel>} props.orgList
 * @param {string} overWrittenValue - valueCreator를 이용해서 만든 값, 기존의 value를 내부적으로 유지한 채로 보여주는 값만 바꿀 때 사용
 */
function OrganizationDropdown({ orgList, onChange, overwrittenValue }) {
  const { orgStore, userStore } = useCoreStores();
  const [defaultValue, setDefaultValue] = useState('');

  // org 데이터는 실시간으로 바뀌지 않으므로 index를 id로 써도 무방
  const orgConverter = useCallback(
    (org, index) => ({
      id: index,
      title: org.orgName,
      value: valueCreator(org),
      children: org.children ? org.children.map(orgConverter) : null,
    }),
    [],
  );

  const handleDropdownChange = useCallback(
    async value => {
      await orgStore.getUserOrgUserList(
        ...value.split('_'),
        userStore.myProfile.id,
      );
      onChange(value);
      setDefaultValue(value);
    },
    [onChange, orgStore, userStore.myProfile.id],
  );

  useEffect(() => {
    (async () => {
      const { companyCode, departmentCode } =
        (await orgStore.getOrgUserDept(userStore.myProfile.id)) || {};

      setDefaultValue(valueCreator({ companyCode, departmentCode }));
      handleDropdownChange(valueCreator({ companyCode, departmentCode }));
    })();
  }, [handleDropdownChange, onChange, orgStore, userStore.myProfile.id]);

  return useObserver(() => (
    <TreeSelect
      dropdownClassName="teespace-common"
      treeDefaultExpandedKeys={[defaultValue]}
      value={overwrittenValue || defaultValue}
      treeData={orgList.map(orgConverter)}
      treeNodeLabelProp="title"
      onChange={handleDropdownChange}
      placeholder="please select"
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ minWidth: 500 }}
    />
  ));
}

export default OrganizationDropdown;
OrganizationDropdown.valueCreator = valueCreator;

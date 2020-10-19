import React from 'react';
import { useObserver } from 'mobx-react';
import { TreeSelect } from 'teespace-core';

function OrganizationDropdown({ orgList, handleChange }) {
  // org 데이터는 실시간으로 바뀌지 않으므로 index를 id로 써도 무방
  const orgConverter = (org, index) => ({
    id: index,
    title: org.orgname,
    value: `["${org.companycode}", "${org.departmentcode}"]`,
    children: org.childrenorg ? org.childrenorg.map(orgConverter) : null,
  });

  return useObserver(() => (
    <TreeSelect
      dropdownClassName="teespace-common"
      treeData={orgList.map(orgConverter)}
      treeNodeLabelProp="title"
      onChange={handleChange}
      placeholder="please select"
      dropdownMatchSelectWidth={false}
      dropdownStyle={{ minWidth: 500 }}
    />
  ));
}

export default OrganizationDropdown;

import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react';
import { TreeSelect } from 'antd';
import { useCoreStores } from 'teespace-core';

const treeData = [
  {
    title: 'All',
    children: [
      {
        id: 1,
        value: 'TmaxGroup',
        title: 'TmaxGroup',
        children: [
          {
            id: 2,
            title: 'TmaxSoft International',
            value: 'TmaxSoft Int',
            children: [
              { id: 1, title: 'Global Marketing', value: 'Global Marketing' },
              {
                id: 2,
                title: 'TmaxAMS',
                value: 'TmaxAMS',
                children: [
                  { title: 'AMS PM Division', value: 'AMS PM Divison' },
                ],
              },
            ],
          },
          {
            id: 3,
            title: '데이터그룹',
            value: '데이터그룹',
          },
          {
            id: 4,
            title: '소프트그룹',
            value: '소프트그룹',
          },
          {
            id: 5,
            title: '에이엔씨그룹',
            value: '에이엔씨그룹',
          },
        ],
      },
    ],
  },
];

function OrganizationDropdown() {
  const { orgStore } = useCoreStores();

  useEffect(() => {
    orgStore.getOrgTree();
  }, [orgStore]);

  // org 데이터는 실시간으로 바뀌지 않으므로 index를 id로 써도 무방
  const orgConverter = (org, index) => ({
    id: index,
    title: org.orgname,
    value: [org.companycode, org.departmentcode],
    children:
      org.childrenorg && org.childrenorg.orgList
        ? org.childrenorg.orgList.map(orgConverter)
        : null,
  });

  const handleOrgChange = value => {
    orgStore.getOrgUserList(...value);
  };

  return useObserver(() => (
    <TreeSelect
      treeData={orgStore.orgList.map(orgConverter)}
      onChange={handleOrgChange}
      style={{ width: '100%' }}
      placeholder="please select"
    />
  ));
}

export default OrganizationDropdown;

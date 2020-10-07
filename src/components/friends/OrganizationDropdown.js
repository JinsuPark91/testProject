import React from 'react';
import { Menu, Dropdown, Button, TreeSelect } from 'antd';
import { DownOutlined } from '@ant-design/icons';


const menu = (
  <Menu>
    <Menu.SubMenu title="AC본부">
      <Menu.Item>AC1-1팀</Menu.Item>
    </Menu.SubMenu>
  </Menu>
);

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
              { title: 'Global Marketing', value: 'Global Marketing' },
              {
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
  return (
    <TreeSelect
      treeData={treeData}
      style={{ width: '100%' }}
      placeholder="please select"
      treeDefaultExpandAll
    />
  );
}

export default OrganizationDropdown;

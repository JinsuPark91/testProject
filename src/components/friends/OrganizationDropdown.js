import React from 'react';
import styled from 'styled-components';
import { useObserver } from 'mobx-react';
import { TreeSelect } from 'antd';

const StyledTreeSelect = styled(TreeSelect)`
  width: auto;
  min-width: 72px;
  .ant-select-selector {
    outline: none !important;
    border-width: 0 !important;
    box-shadow: none !important;
    border-radius: 15px !important;
    transition: none !important;
  }

  &.ant-select-focused:not(.ant-select-open) .ant-select-selector {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }

  &.ant-select-open .ant-select-selector {
    color: #523dc7;
    border: 1px solid #6c56e5 !important;
    background-color: #dcddff;
  }

  &:not(.ant-select-open) .ant-select-selector {
    &:hover {
      background-color: #dcddff;
      border: 1px solid #c6ced6 !important;
    }
  }
`;

function OrganizationDropdown({ orgList, handleChange }) {
  // org 데이터는 실시간으로 바뀌지 않으므로 index를 id로 써도 무방
  const orgConverter = (org, index) => ({
    id: index,
    title: org.orgname,
    value: `["${org.companycode}", "${org.departmentcode}"]`,
    children: org.childrenorg ? org.childrenorg.map(orgConverter) : null,
  });

  return useObserver(() => (
    <StyledTreeSelect
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

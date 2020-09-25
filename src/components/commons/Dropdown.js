import React from 'react';
import styled from 'styled-components';
import { Divider, Dropdown, Menu } from 'antd';
import CommonInput from './Input';

const StyledMenuWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #c6ced6;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.35);
  border-radius: 4px;
  min-width: 72px;
`;

const StyledMenu = styled(Menu)`
  border-radius: 4px;
  .ant-menu-item {
    color: #000000;
    border-radius: 13px;
    &.ant-menu-item-active {
      background: #dcddff;
    }
    &.ant-menu-item-selected {
      background: #bcbeff;
      color: #010101;
    }
  }
`;

const MenuSearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6px 11px;
`;

const { Item } = StyledMenu;

const CommonMenuWrapper = ({ searchable, overlay, data, onSearch }) => {
  return (
    <StyledMenuWrapper>
      <StyledMenu>
        {searchable && data.map(item => <Item key={item}>{item}</Item>)}
        {!searchable && overlay}
      </StyledMenu>
      <Divider style={{ margin: 0 }} />
      {searchable && (
        <MenuSearchWrapper>
          <CommonInput
            onClick={e => e.stopPropagation()}
            onChange={e => onSearch(e.target.value)}
          />
        </MenuSearchWrapper>
      )}
    </StyledMenuWrapper>
  );
}
/**
 * Common Dropdown
 * @param {Object} props
 * @param {boolean} props.searchable
 * @param {Array=} props.data
 * @param {function=} props.onSearch
 */
function CommonDropdown(props) {
  const { children, searchable, overlay, onSearch, data } = props;
  const antdProps = {
    ...props,
  };

  delete antdProps.searchable;
  antdProps.overlay = (
    <CommonMenuWrapper
      searchable={searchable}
      overlay={overlay}
      data={data}
      onSearch={onSearch}
    />
  );

  return (
    <Dropdown trigger={['click']} {...antdProps}>
      {children}
    </Dropdown>
  );
}
export const CommonMenu = StyledMenu;
export default CommonDropdown;

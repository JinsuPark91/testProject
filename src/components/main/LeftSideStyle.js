import { Children } from 'react';
import styled from 'styled-components';
import { Tabs } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  width: 16.19rem;
  height: 100%;
  flex-shrink: 0;
  .ant-tabs-content-holder {
    height: 100%;
  }
`;

export const CustomTabs = styled(Tabs)`
  &.ant-tabs {
    width: 100%;
  }
  .ant-tabs-content {
    border-right: 1px solid ${props => props.theme.LineMain};
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .ant-tabs-nav {
    margin: 0;
    &:before {
      border-color: ${props => props.theme.LnbLine};
      z-index: 5;
    }
    .ant-tabs-ink-bar {
      height: 0;
    }
  }
  .ant-tabs-nav-list {
    flex: 1;
  }

  .ant-tabs-nav-operations {
    display: none !important;
  }
  .ant-tabs-tab {
    width: ${({ children }) =>
      `calc(100% / ${Children.toArray(children).length})`};
    justify-content: center;
    margin: 0;
    padding: 0;
    height: 3.13rem;
    background: ${props => props.theme.LnbNormal};
    font-size: 0;
    &:hover:not(.ant-tabs-tab-active) {
      .lnb__icon-wrapper {
        background-color: ${props => props.theme.LnbHover};
      }
    }
  }

  .ant-tabs-tab-active .lnb__icon-wrapper {
    background-color: ${props => props.theme.LnbActive};
  }
`;

export const UnreadCount = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  position: absolute;
  top: 0.31rem;
  left: 50%;
  height: 0.875rem;
  margin-left: 0.75rem;
  padding: 0 0.25rem;
  font-size: 0.69rem;
  color: #fff;
  line-height: 0.8125rem;
  font-weight: 400;
  border-radius: 0.56rem;
  background-color: #dc4547;
  text-align: center;
  flex-shrink: 0;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5.13rem;
  height: 2.75rem;
  border-radius: 0.625rem;
`;

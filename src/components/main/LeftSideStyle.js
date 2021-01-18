import styled from 'styled-components';
import { Tabs } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  width: 16.19rem;
  height: 100%;
  flex-shrink: 0;
`;

export const CustomTabs = styled(Tabs)`
  &.ant-tabs {
    width: 100%;
  }
  .ant-tabs-content {
    border-right: 1px solid #e3e7eb;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .ant-tabs-nav {
    margin: 0;
    .ant-tabs-ink-bar {
      height: 0;
    }
  }
  .ant-tabs-nav-list {
    flex: 1;
  }
  .ant-tabs-tab {
    width: calc(100% / 3);
    justify-content: center;
    margin: 0;
    padding: 0;
    height: 3.13rem;
    background-color: #0b1d41;
    font-size: 0;
    &:hover {
      background-color: #2d317a;
    }
  }

  .ant-tabs-tab-active .lnb__icon-wrapper {
    background: #ffffff;
  }
`;

export const UnreadCount = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 3.25rem;
  min-width: 1.44rem;
  padding: 0.125rem 0.19rem;
  font-size: 0.63rem;
  line-height: 0.75rem;
  font-weight: 400;
  color: #fff;
  border-radius: 0.56rem;
  background-color: #ff486d;
  text-align: center;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5.13rem;
  height: 2.75rem;
  border-radius: 10px;
`;

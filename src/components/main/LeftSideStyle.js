import styled from 'styled-components';
import { Tabs } from 'antd';

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 16.19rem;
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
      height: 3px;
      background-color: #ff486d;
      border-radius: 3px;
    }
  }
  .ant-tabs-nav-list {
    flex: 1;
  }
  .ant-tabs-tab {
    width: calc(100% / 3);
    justify-content: center;
    margin: 0;
    padding: 0.75rem 0 0.5rem;
    background-color: #0b1d41;
    font-size: 0;
    &:hover {
      background-color: #07142d;
    }
  }
`;

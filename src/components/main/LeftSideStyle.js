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
    border-right: 1px solid #ddd9d4;
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
    background-color: #232d3b;
    font-size: 0;
    &:hover:not(.ant-tabs-tab-active) {
      .lnb__icon-wrapper {
        background-color: #313a46;
      }
    }
  }

  .ant-tabs-tab-active .lnb__icon-wrapper {
    background-color: #fff;
  }
`;

export const UnreadCount = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
  position: absolute;
  top: 0.31rem;
  right: 0.31rem;
  font-size: 0.63rem;
  font-weight: 400;
  color: #fff;
  border-radius: 9px;
  background-color: #dc4547;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5.13rem;
  height: 2.75rem;
  border-radius: 10px;
`;

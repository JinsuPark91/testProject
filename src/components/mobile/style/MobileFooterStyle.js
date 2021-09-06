import styled from 'styled-components';
import { Tabs } from 'antd';

export const Wrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const NewBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0.5rem;
  right: 1.4rem;
  padding: 0 0.25rem;
  min-width: 1rem;
  min-height: 1rem;
  line-height: 1;
  font-size: 0.56rem;
  color: #fff;
  font-weight: 400;
  border-radius: 50%;
  background-color: #dc4547;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 5.63rem;
  height: 3.13rem;
`;

export const FooterTab = styled(Tabs)`
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
    background-color: #f2ede6;
  }

  .ant-tabs-nav-operations {
    display: none !important;
  }
  .ant-tabs-tab {
    width: calc(100% / 2);
    justify-content: center;
    margin: 0;
    padding: 0;
    height: 3.13rem;
    background-color: #f2ede6;
    font-size: 0;
    &:hover:not(.ant-tabs-tab-active) {
      .icon-wrapper {
        background-color: #f2ede6;
      }
    }
  }

  .ant-tabs-tab-active .icon-wrapper {
    background-color: #f2ede6;
  }
`;

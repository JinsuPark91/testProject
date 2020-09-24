import React from 'react';
import styled from 'styled-components';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const TabsType1 = styled(Tabs)`
  width: 100%;

  .ant-tabs-nav {
    height: 60px;
    .ant-tabs-ink-bar {
      background: ${props => props.barcolor};
      height: 3px;
    }
  }

  .ant-tabs-nav-list {
    flex: 1;
  }

  .ant-tabs-tab {
    flex: 1;
    justify-content: center;
    margin: 0;
    background: transparent;
    font-size: 12px;

    .ant-tabs-tab-btn {
      color: #777777;
    }

    &.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${props => props.textcolor || '#000000'};
    }
  }
`;

const TabsType2 = styled(Tabs)`
  .ant-tabs-nav {
    height: 35px;
    .ant-tabs-ink-bar {
      height: 0;
    }

    &::before {
      border: 0 !important;
    }
  }

  .ant-tabs-nav-list {
    flex: 0;
    background-color: #ffffff;
    border: 1px solid #e5e9ed;
    border-radius: 27.5px;
    align-items: center;
  }

  .ant-tabs-tab {
    &.ant-tabs-tab-active {
      background-color: ${props => props.barcolor} !important;
      .ant-tabs-tab-btn {
        border: none;
        color: ${props => props.textcolor || '#ffffff'};
      }
    }
    height: 27px;
    padding: 7px 15px;
    margin: 4px;
    border-radius: 27.5px;
    justify-content: center;
    background: transparent;
    font-size: 12px;

    .ant-tabs-tab-btn {
      color: #777777;
    }
  }
`;

/**
 * Common Tabs
 * @param {Object} props
 * @param {string} barColor
 * @param {string} textColor
 */
function CommonTabs(props) {
  const { type = '1', children, barColor = '#6C56E5', textColor } = props;
  const antdProps = {
    ...props,
  };

  // delete only used properties in a styled components
  delete antdProps.barColor;
  delete antdProps.textColor;

  return (
    <>
      {type === '1' && (
        <TabsType1 {...antdProps} barcolor={barColor} textcolor={textColor}>
          {children}
        </TabsType1>
      )}
      {type === '2' && (
        <TabsType2 {...antdProps} barcolor={barColor} textcolor={textColor}>
          {children}
        </TabsType2>
      )}
    </>
  );
}

export function CommonTabPane(props) {
  const { children } = props;
  return <TabPane {...props}>{children}</TabPane>;
}

export default CommonTabs;

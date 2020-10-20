import React, { Component } from 'react';
import styled from 'styled-components';
import { PageHeader } from 'antd';

const StyledPageHeader = styled(PageHeader)`
  .ant-page-header-heading-left {
    flex-direction: column;
    align-items: flex-start;
  }
`;

class SettingContentTitle extends Component {
  render() {
    return (
      <StyledPageHeader
        className="site-page-header"
        title={this.props.title}
        subTitle={this.props.subTitle}
      ></StyledPageHeader>
    );
  }
}
export default SettingContentTitle;

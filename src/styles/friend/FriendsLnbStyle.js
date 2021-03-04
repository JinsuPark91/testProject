import styled from 'styled-components';
import { Layout } from 'antd';

export const FriendsLnbWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
`;

const { Footer } = Layout;

export const FooterWrapper = styled(Footer)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding: 0.69rem 0.94rem;
  background-color: #fff;
  box-shadow: 0 -0.8125rem 0.75rem -0.1875rem #fff;
  z-index: 5;
`;

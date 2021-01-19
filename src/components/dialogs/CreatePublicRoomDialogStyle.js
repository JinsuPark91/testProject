import { Modal, Checkbox } from 'antd';
import styled, { css } from 'styled-components';

export const InfoContainer = styled.div`
  padding: 2.38rem 1.25rem 2rem;
  border-bottom: 1px solid #e3e7eb;
`;

export const ButtonContainer = styled.div`
  display: flex;
  padding: 1.06rem 0;
  align-items: center;
  justify-content: center;

  button:not(:last-child) {
    margin-right: 0.38rem;
  }
`;

export const FlexModal = styled(Modal)`
  font-size: 16px;
  display: flex;
  justify-content: center;

  & .ant-modal-header {
    border-bottom: 1px solid #e3e7eb;
  }

  & .ant-modal-body {
    padding: 0;
  }
`;

export const Description = styled.div`
  font-size: 0.69rem;
  line-height: 1.06rem;
  color: #8d8d8d;
`;

export const ConfigWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.81rem 1.19rem 0 1.19rem;
  border-top: 1px solid #e3e7eb;
`;

export const Title = styled.div`
  font-size: 0.81rem;
  line-height: 1.13rem;
  font-weight: 500;
  color: #000;
`;

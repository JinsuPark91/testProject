import { Modal } from 'antd';
import styled, { css } from 'styled-components';

export const ConfigTitle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

export const ConfigTitleText = styled.span`
  margin-left: 0.38rem;
  font-size: 0.81rem;
  line-height: 0.94rem;
  font-weight: 500;
`;

export const ConfigDescriptionText = styled.div`
  margin: 0.19rem 0 0.94rem 1.32rem;
  white-space: pre-line;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #777;
`;

export const FlexModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
`;

export const ConfigWrapper = styled.div`
  width: 32.5rem;
  padding: 0.19rem 1.88rem 1.19rem;
  border: solid ${props => props.theme.LineMain};
  border-width: 1px 0;
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

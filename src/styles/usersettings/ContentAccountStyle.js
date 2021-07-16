import styled, { css } from 'styled-components';
import InputCounter from '../../components/Input';

export const AccountContent = styled.div`
  overflow-y: auto;
  height: 100%;
  padding: 1.125rem;
`;

export const ImageBox = styled.div`
  width: 2.125rem;
  height: 2.125rem;
  img {
    width: 100%;
    height: 100%;
  }
`;

export const ContentBox = styled.div`
  padding: 0.875rem 6rem 0 0;
  & + & {
    margin-top: 1.125rem;
    border-top: 1px solid ${({ theme }) => theme.LineMain};
  }
`;

export const ContentItem = styled.div`
  display: flex;
  font-size: 0.813rem;
  line-height: 1.875rem;
  color: ${props => props.theme.TextMain};
  & + & {
    margin-top: 0.375rem;
  }
`;

export const ItemTitle = styled.div`
  min-width: 13.13rem;
  padding-right: 1.25rem;
`;

export const ItemInfo = styled.div`
  display: flex;
  ${props =>
    props.isPwEdit &&
    css`
      flex-direction: column;
    `}
  flex: 1;
  font-weight: 500;

  .ant-radio-wrapper {
    vertical-align: middle;
  }
`;

export const FormItemWrap = styled.div`
  margin-bottom: 1.313rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: ${({ theme }) => theme.TextMain};
`;

export const ItemLabel = styled.div`
  padding-bottom: 0.625rem;
  line-height: 1.125rem;
  font-weight: 400;
`;

export const TextLink = styled.button`
  margin-left: 0.25rem;
  border: none;
  background-color: transparent;
  text-decoration: underline;
  color: ${({ theme }) => theme.GreenVivid};
`;

export const ButtonBox = styled.div`
  margin-left: auto;
  text-align: right;
  .ant-btn,
  .ant-tooltip-disabled-compatible-wrapper + .ant-btn {
    margin-left: 0.5rem;
  }
`;

export const EditNameInput = styled(InputCounter)`
  width: 12.5rem;
  input {
    font-weight: 500;
  }
  .input-counter {
    font-size: 0.688rem;
  }
`;

export const FormNotice = styled.div`
  display: flex;
  margin-top: 0.313rem;
`;

export const NoticeItemWrap = styled.div`
  & + & {
    margin-left: 0.938rem;
  }

  span {
    font-size: 0.75rem;
    color: ${({ pass, theme }) =>
      pass ? theme.TextPoinGreen : theme.TextSub2};
    margin-left: 0.25rem;
  }
`;

export const PwInfo = styled.span`
  margin-left: 0.25rem;
`;

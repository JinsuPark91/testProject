import { Button } from 'antd';
import styled, { css } from 'styled-components';

export const ContentDataWrap = styled.div`
  overflow-y: auto;
  height: 100%;
  padding: 0 1.25rem 1.25rem;
`;

export const FormItemMain = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem 0 2rem 0;
`;

export const AlarmList = styled.div`
  width: 26rem;
`;

export const FormItem = styled(FormItemMain)`
  min-height: 3.313rem;
  margin-top: 0;
  padding: 0.5625rem 0;
  border-top: 1px solid ${props => props.theme.LineSub};
  &:first-of-type {
    border-top: 0;
  }
  .ant-switch {
    margin: 0.4375rem 0 auto;
  }
`;

export const ItemMain = styled.label`
  span {
    padding-left: 0.56rem;
    font-size: 0.75rem;
    vertical-align: middle;
  }
`;

export const ItemInfo = styled.div`
  flex: 1;
`;

export const ItemTitle = styled.label`
  display: block;
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: ${props => props.theme.TextSub};
`;

export const ItemTitleBlack = styled(ItemTitle)`
  color: ${props => props.theme.TextMain};
`;

export const ItemSub = styled.div`
  margin: 0.63rem 0 0.4375rem;
  color: ${props => (props.isEmail ? '#818181' : `${props.theme.TextMain}`)};
  font-size: ${props => (props.isSmall ? '0.75rem' : '0.81rem')};
  .ant-checkbox-wrapper {
    font-size: 0.81rem;
    & + .ant-checkbox-wrapper {
      margin-left: 1.25rem;
    }
  }
  .ant-checkbox + span {
    padding: 0 0 0 0.38rem;
  }
`;

export const SoundText = styled.span`
  vertical-align: middle;
`;

export const SoundButton = styled(Button)`
  width: 1.5rem;
  min-width: auto;
  height: 1.5rem;
  margin-left: 0.19rem;
  line-height: 0;
  background-color: transparent;
  border: 1px solid;
  border-color: transparent;
  svg {
    width: 1rem;
    height: 1rem;
    color: #75757f;
    vertical-align: middle;
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  &:hover {
    background-color: ${props => props.theme.SubStateNormal};
    background-color: ${props => props.theme.SubStateNormal};
    border-color: ${props => props.theme.SubStateNormal};
    svg {
      color: ${props => props.theme.IconNormal};
    }
  }
  &:active,
  &:focus {
    background-color: ${props => props.theme.SubStateDark};
    border-color: ${props => props.theme.SubStateDark};
    svg {
      color: ${props => props.theme.IconActive};
    }
  }
  ${props =>
    props.checked &&
    css`
      svg {
        color: ${props.theme.IconActive};
      }
    `}
`;

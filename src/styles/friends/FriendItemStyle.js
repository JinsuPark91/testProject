import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  .lnb-friend__more-icon,
  .lnb-friend__export-icon {
    display: none;
  }

  &:hover {
    .lnb-friend__more-icon,
    .lnb-friend__export-icon {
      display: flex;
    }
    .lnb-friend__new-icon {
      display: none;
    }
  }
`;

export const FriendItemWrapper = styled.div`
  /* 조직도 조회, 추천친구 스타일 */
  display: flex;
  margin: 0 0.25rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  align-items: center;
  cursor: pointer;

  /* icon */
  .ant-btn-circle {
    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    box-shadow: none;
    border: 0;
    color: #75757f;
    &:hover {
      background-color: #dcddff;
    }
    &:active,
    &:focus {
      background-color: transparent;
    }
  }

  ${props =>
    (props.mode === 'me' || props.mode === 'member') &&
    css`
      padding: 0.69rem 0.375rem 0.69rem 0.5rem;
    `}

  ${props =>
    props.mode === 'friend' &&
    css`
      padding: 0.56rem 0.375rem 0.56rem 0.5rem;
    `}

  ${props =>
    props.isActive
      ? css`
          background-color: #f2efec;
          border-radius: 0.81rem;
        `
      : css`
          &:hover {
            background-color: #faf8f7;
            border-radius: 0.81rem;
          }
        `}

    ${({ isDndHover }) =>
    isDndHover &&
    css`
      background: rgba(236, 98, 34, 0.05);
      border-radius: 0.81rem;
      box-shadow: 0 0 0 1px #ec6222 inset;
    `}
`;

export const TextWrapper = styled.div`
  overflow: hidden;
  flex: 1 0;
  margin-left: 0.4375rem;
`;

export const TextStatus = styled.div`
  overflow: hidden;
  margin-top: 0.125rem;
  font-size: 0.69rem;
  line-height: 1rem;
  font-weight: 300;
  color: #7f7f7f;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TextComponentBox = styled.div`
  display: flex;
  align-items: center;
`;

export const TitleForName = styled.span`
  font-size: 0.81rem;
  font-weight: 500;
  line-height: 1.19rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const NewFriendBadge = styled.div`
  height: 0.875rem;
  width: 0.875rem;
  margin: 0 0.25rem;
  line-height: 0.8125rem;
  font-size: 0.63rem;
  color: #fff;
  font-weight: 400;
  border-radius: 50%;
  background-color: #dc4547;
  text-align: center;
`;

export const StyledAvatar = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 2.13rem;
  height: 2.13rem;
  margin: 0.0652rem 0;
  border: 1px solid #fff;
  border-radius: 50%;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const MeWrapper = styled.div`
  width: 0.88rem;
  height: 0.88rem;
  flex-shrink: 0;
  margin-right: 0.25rem;
  line-height: 0;
  img {
    width: 100%;
    height: 100%;
  }
`;

export const MoreIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  &:hover {
    background-color: #eae6e0;
  }
`;

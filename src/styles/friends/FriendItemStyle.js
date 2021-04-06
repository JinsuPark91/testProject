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
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  ${props =>
    (props.mode === 'addFriend' || props.mode === 'recommended') &&
    css`
      width: calc(100% - 1.5rem + 8px);
      height: 3rem;
      background-color: transparent;
      border-bottom: 1px solid #e3e7eb;
      padding: 0 0.63rem;
      margin-left: 0.75rem;
      margin-right: calc(0.75rem - 8px);

      &:hover {
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      }

      /* icon */
      .ant-btn-circle {
        background: transparent;
        box-shadow: 0;
        border: 0;
        color: #75757f;
        &:hover {
          color: #75757f;
          background-color: #dcddff;
        }
      }
    `}

  ${props =>
    props.mode === 'me' &&
    css`
      padding: 0.69rem 0.38rem 0.69rem 0.5rem;
    `}

    ${props =>
    props.mode === 'friend' &&
    css`
      padding: 0.56rem 0.38rem 0.56rem 0.5rem;
    `}

  /* 내 프로필 아이템과 친구 아이템의 스타일 */
  ${props =>
    (props.mode === 'me' || props.mode === 'friend') &&
    css`
      margin: 0 0.25rem;
      align-items: center;

      ${props.isActive
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
  height: 1rem;
  width: 1rem;
  margin: 0 0.125rem 0 0.25rem;
  line-height: 0.94rem;
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
  ${props => {
    switch (props.mode) {
      case 'me':
        return css`
          width: 2.13rem;
          height: 2.13rem;
          margin: 0.0652rem 0;
          border: 1px solid #fff;
        `;
      case 'addFriend':
        return css`
          width: 2rem;
          height: 2rem;
          &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: 50%;
          }
        `;
      case 'friend':
      default:
        return css`
          width: 2.13rem;
          height: 2.13rem;
          margin: 0.0652rem 0;
          border: 1px solid #fff;
        `;
    }
  }}
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

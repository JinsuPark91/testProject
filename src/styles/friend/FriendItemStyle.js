import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  .friend-more-icon,
  .friend-export-icon {
    display: none;
  }
  .friend-new-icon {
    display: flex;
  }

  &:hover {
    .friend-more-icon,
    .friend-export-icon {
      display: flex;
    }
    .friend-new-icon {
      display: none;
    }
  }
`;

export const FriendItemWrapper = styled.div`
  /* 조직도 조회, 추천친구 스타일 */
  height: 3rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  ${props =>
    (props.mode === 'addFriend' || props.mode === 'recommended') &&
    css`
      width: calc(100% - 1.5rem + 8px);
      display: flex;
      flex-direction: row;
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

  /* 내 프로필 아이템과 친구 아이템의 스타일 */
  ${props =>
    (props.mode === 'me' || props.mode === 'friend') &&
    css`
      display: flex;
      flex-direction: row;
      margin: 0 0.25rem;
      padding: 0 0.38rem 0 0.5rem;

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

export const ProfileWrapper = styled.div`
  align-items: center;
  display: flex;

  /* me badge */
  .ant-badge-count {
    margin-left: -2.125rem;
  }
`;

export const TextWrapper = styled.div`
  margin-left: 0.4375rem;
  flex-grow: 1;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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

export const StyledWrapper = styled.div`
  position: relative;
`;

export const NewFriendBadge = styled.div`
  height: 1rem;
  width: 1rem;
  line-height: 1rem;
  font-size: 0.63rem;
  color: #fff;
  font-weight: 400;
  justify-content: center;
  border-radius: 50%;
  background-color: #dc4547;
`;

export const StyledAvatar = styled.div`
  position: relative;
  ${props => {
    switch (props.mode) {
      case 'me':
        return css`
          width: 2.25rem;
          height: 2.25rem;
        `;
      case 'addFriend':
        return css`
          width: 2rem;
          height: 2rem;
        `;
      case 'friend':
      default:
        return css`
          width: 2.125rem;
          height: 2.125rem;
        `;
    }
  }}
  border-radius: 50%;
  background-color: #fff;
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

import styled, { css, keyframes } from 'styled-components';

export const ProfileIcon = styled.div`
  position: relative;
  cursor: pointer;
`;

// const jump = keyframes`
//   0% {
//     top: 0.1rem;
//   }
//   50% {
//     top: -0.3rem;
//   }
//   100% {
//     top: 0.1rem;
//   }
// }
// `;

// ${props =>
//   props.count > 0 &&
//   css`
//     animation: ${jump} 1s ease-in-out;
//   `}

export const NewBadge = styled.div`
  position: absolute;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #dc4547;
  top: 0.1rem;
  right: 0.1rem;
`;

export const ThumbImage = styled.img`
  width: 1.88rem;
  height: 1.88rem;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  object-fit: cover;
`;

export const SettingImage = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -0.1875rem;
  bottom: -0.1875rem;
  width: 1.06rem;
  height: 1.06rem;
  border-radius: 50%;
  background-color: #fff;
  img {
    width: 0.81rem;
    height: 0.81rem;
  }
`;

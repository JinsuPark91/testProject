import styled from 'styled-components';

export const ProfileIcon = styled.div`
  position: relative;
  cursor: pointer;
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
  background-color: ${props => props.theme.StateNormal};
`;

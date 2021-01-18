import styled from 'styled-components';
import Photos from '../Photos';

export const Wrapper = styled.div`
  display: flex;
  height: 3.13rem;
  align-items: center;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-bottom: 1px solid #ddd9d4;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 0 0.9375rem;
  min-width: 0;
  flex: auto;
  height: 100%;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: auto;
  height: 100%;
`;

export const SystemIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const AppIconContainer = styled.div`
  display: flex;
  align-items: center;
  border-left: 1px solid #ddd9d4;
  border-right: 1px solid #ddd9d4;
  height: 40px;
  padding: 0 0.6rem;

  & .header__app-icon:not(:last-child) {
    margin-right: 0.6rem;
  }
`;

export const UserMenu = styled.div`
  padding: 0 0.625rem;
`;

export const UserCountText = styled.div`
  font-size: 0.875rem;
  margin-left: 0.5rem;
  opacity: 0.5;
  margin-right: 0.5rem;
`;

export const TitleText = styled.div`
  font-size: 0.875rem;
  margin-left: 0.5rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const IconWrapper = styled.div`
  display: flex;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  opacity: 0.85;
  &:hover {
    background: #eae6e0;
  }
`;

export const AppIconWrapper = styled.div`
  display: flex;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  align-items: center;
  justify-content: center;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  opacity: 0.85;

  &:hover {
    background: #ebe6df;
  }
`;

export const StyledPhotos = styled(Photos)`
  flex-shrink: 0;
`;

export const VerticalBar = styled.div`
  width: 1px;
  height: 100%;
  background: #ddd9d4;
  margin-right: 0.6rem;
`;

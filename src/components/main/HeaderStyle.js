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
  padding-right: 0.9375rem;
`;

export const AppIconContainer = styled.div`
  display: flex;
  align-items: center;
  border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
  height: 40px;
  padding: 0 0.9375rem;

  & .header__app-icon:not(:last-child) {
    margin-right: 0.75rem;
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
  padding: 0.3rem;
  border-radius: 50%;
  &:hover {
    background: #dcddff;
  }
`;

export const AppIconWrapper = styled.div`
  overflow: hidden;
  width: 1.5rem;
  height: 1.5rem;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
`;

export const StyledPhotos = styled(Photos)`
  flex-shrink: 0;
`;

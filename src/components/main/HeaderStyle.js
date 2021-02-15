import styled from 'styled-components';
import Photos from '../Photos';

export const Wrapper = styled.div`
  display: flex;
  height: 3.13rem;
  padding: 0 0.81rem 0 0.63rem;
  align-items: center;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-bottom: 1px solid #ddd9d4;
  background-color: #fff;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: auto;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  flex: auto;
  padding-right: 1.13rem;
`;

export const SystemIconContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 0.3125rem;
`;

export const AppIconContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  padding: 0 0.6875rem;
  &:before,
  &:after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 50%;
    width: 1px;
    height: 1.5rem;
    margin-top: -0.75rem;
    background-color: #ddd9d4;
  }
  &:before {
    left: 0;
  }
  &:after {
    right: 0;
  }
`;

export const AppIconbutton = styled.div`
  margin-right: 0.3125rem;

  &:last-child {
    margin-right: 0;
  }
`;

export const AppIconInner = styled.button`
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  background-color: transparent;
  border: none;
  align-items: center;
  justify-content: center;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  opacity: 0.85;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: #ebe6df;
  }
`;

export const UserMenu = styled.div`
  padding-left: 0.94rem;
`;

export const UserCountText = styled.div`
  margin-left: 0.25rem;
  font-size: 0.875rem;
  opacity: 0.5;
`;

export const TitleText = styled.div`
  font-size: 0.875rem;
  margin-left: 0.63rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const IconWrapper = styled.button`
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  margin-right: 0.3125rem;
  border-radius: 0.25rem;
  background-color: transparent;
  border: none;
  opacity: 0.85;
  cursor: pointer;

  &:hover {
    background-color: #eae6e0;
  }
`;

export const StyledPhotos = styled(Photos)`
  flex-shrink: 0;
`;

export const VerticalBar = styled.div`
  width: 1px;
  height: 100%;
  background: #ddd9d4;
  margin-right: 0.4rem;
`;

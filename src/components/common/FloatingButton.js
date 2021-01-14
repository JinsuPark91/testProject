import React, { useState, useEffect } from 'react';
import {
  FloatingMenu,
  MainButton,
  ChildButton,
} from 'react-floating-button-menu';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { Tooltip } from 'antd';

import { ChattingIcon, CancelIcon, ArrowDownIcon, ArrowUpIcon } from '../Icons';

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const ChildItem = ({ roomInfo, onItemClick, onItemClose }) => {
  const handleClick = () => {
    onItemClick(roomInfo);
  };

  const handleClose = e => {
    e.stopPropagation();
    onItemClose(roomInfo);
  };

  return (
    <ChildItemWrapper onClick={handleClick}>
      <Tooltip placement="top" title={roomInfo.name} color="#0B1D41">
        <div>{roomInfo.name.slice(0, 4)}</div>
      </Tooltip>
      <div style={{ height: '1rem' }}>
        {roomInfo.userCount > 3 ? roomInfo.userCount : ''}
      </div>
      <div className="close-button" onClick={handleClose}>
        <CancelIcon width={0.8} height={0.8} color="#ffffff" />
      </div>
    </ChildItemWrapper>
  );
};

const MainItem = ({
  visible = false,
  handleMainClick = () => {},
  // visibleCloseButton = false,
  // handleAllClose = () => {},
}) => {
  return (
    <MainItemWrapper visible={visible} onClick={handleMainClick}>
      <ChattingIcon width={2.69} height={1.88} />
      {/* {visibleCloseButton ? (
        <div className="close-button" onClick={handleAllClose}>
          <CancelIcon width={0.8} height={0.8} color="#ffffff" />
        </div>
      ) : null} */}
    </MainItemWrapper>
  );
};

const ArrowIcon = ({ width, height, isPrev }) => {
  const props = {
    width,
    height,
    color: 'gray',
  };
  return isPrev ? <ArrowDownIcon {...props} /> : <ArrowUpIcon {...props} />;
};

const FloatingButton = ({
  visible = false,
  rooms = [],
  count = 5,
  onCloseAll = () => {},
  onItemClick = () => {},
  onItemClose = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrag, setIsDrag] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStartIndex(0);
    }
  }, [isOpen]);

  const handleMainClick = () => {
    if (!isDrag) {
      setIsOpen(!isOpen);
    }
    setIsDrag(false);
  };

  const handleDrag = () => {
    setIsDrag(true);
  };

  const handleAllClose = e => {
    onCloseAll();
  };

  const mainItem = (
    <MainItem
      rooms={rooms}
      visible={visible}
      visibleCloseButton={!!rooms.length}
      // handleAllClose={handleAllClose}
    />
  );

  const next = () => {
    if (rooms.length - count > startIndex) {
      setStartIndex(startIndex + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  if (!visible) return null;

  return (
    <Draggable bounds="parent" onDrag={handleDrag}>
      <Wrapper>
        {isOpen && (
          <AllCloseButton onClick={handleAllClose}>모두 종료</AllCloseButton>
        )}
        <CustomFloatingMenu
          spacing={remToPixel(0.63)}
          direction="up"
          slideSpeed={300}
          isOpen={isOpen}
          size={remToPixel(2)}
          isVisible={isOpen}
        >
          <CustomMainButton
            iconResting={mainItem}
            iconActive={mainItem}
            size={remToPixel(3.5)}
            onClick={handleMainClick}
          />
          <ArrowChildButton
            icon={
              rooms.length > count && startIndex !== 0 ? (
                <ArrowIcon width={1.25} height={1.25} isPrev />
              ) : null
            }
            onClick={rooms.length > count && startIndex !== 0 ? prev : null}
            size={remToPixel(1.5)}
            visible={rooms.length > count && startIndex !== 0}
          />

          {rooms.slice(startIndex, count + startIndex).map(roomInfo => (
            <ChildButton
              icon={
                <ChildItem
                  roomInfo={roomInfo}
                  onItemClick={onItemClick}
                  onItemClose={onItemClose}
                />
              }
              size={remToPixel(3.5)}
            />
          ))}

          <ArrowChildButton
            icon={
              rooms.length > count && startIndex < rooms.length - count ? (
                <ArrowIcon width={1.25} height={1.25} />
              ) : null
            }
            onClick={
              rooms.length > count && startIndex < rooms.length - count
                ? next
                : null
            }
            size={remToPixel(1.5)}
            visible={rooms.length > count && startIndex < rooms.length - count}
          />
        </CustomFloatingMenu>
      </Wrapper>
    </Draggable>
  );
};

export default FloatingButton;

const CustomFloatingMenu = styled(FloatingMenu)`
  & li {
    display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  }
`;

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
`;

const AllCloseButton = styled.div`
  display: flex;
  width: 4.75rem;
  height: 1.88rem;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border: 1px solid #c6ced6;
  border-radius: 0.9rem;
  font-size: 0.75rem;
  color: #3b3b3b;
  align-self: flex-end;
  margin-right: 0.84rem;
  position: absolute;
  right: 3.5rem;
  box-shadow: 0 0 5px 0 #c6ced6;

  &:hover {
    background: #dcddff;
  }

  &:active {
    background: #ffffff;
    box-shadow: unset;
    border: 1px solid #6c56e5;
  }
`;

const CustomMainButton = styled(MainButton)`
  & > div {
    transform: unset;
    width: 100%;
    height: 100%;
  }
`;

const ArrowChildButton = styled(ChildButton)`
  cursor: ${({ visible }) => (visible ? 'pointer' : 'default')};
  margin-top: -10px;
  margin-bottom: 0;
  box-shadow: unset;
`;

const RoundButton = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 50%;
  box-shadow: 0 2px 5px #000000;
  cursor: pointer;
  color: #ffffff;
  font-size: 0.69rem;
  position: relative;

  & .close-button {
    width: 1.88rem;
    height: 1.88rem;
  }

  & .close-button {
    display: none;
    align-items: center;
    justify-content: center;
    position: absolute;
    border-radius: 50%;
    bottom: 0;
  }

  &:hover .close-button {
    display: flex;
  }
`;

const MainItemWrapper = styled(RoundButton)`
  background: #0b1d41;

  &:hover {
    background: #151559;
  }

  &:active {
    background: #342f7d;
  }

  // & .close-button:hover {
  //   background: rgba(0, 0, 0, 0.4);
  // }
`;

const ChildItemWrapper = styled(RoundButton)`
  background: #6c56e5;

  &:hover {
    background: rgba(86, 68, 183, 1);
  }

  & .close-button:hover {
    background: rgba(0, 0, 0, 0.4);
  }
`;

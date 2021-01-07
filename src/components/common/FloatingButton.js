import React, { useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import Draggable from 'react-draggable';
import { Tooltip } from 'antd';
import { ChattingIcon, CancelIcon } from '../Icons';

const ChatItem = ({ roomInfo, onItemClick, onItemClose }) => {
  const handleClick = () => {
    onItemClick(roomInfo);
  };

  const handleClose = e => {
    e.stopPropagation();
    onItemClose(roomInfo);
  };

  return (
    <ItemWrapper onClick={handleClick}>
      <Tooltip placement="top" title={roomInfo.name} color="#0B1D41">
        <div>{roomInfo.name.slice(0, 4)}</div>
      </Tooltip>
      <div style={{ height: '1rem' }}>
        {roomInfo.userCount > 3 ? roomInfo.userCount : ''}
      </div>
      <div className="close__button" onClick={handleClose}>
        <CancelIcon width={0.8} height={0.8} color="#ffffff" />
      </div>
    </ItemWrapper>
  );
};

const CustomArrow = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', background: 'gray' }}
      onClick={onClick}
    />
  );
};

const FloatingButton = ({
  visible = false,
  roomList = [],
  slidesToShow = 7,
  onCloseAll = () => {},
  onItemClick = () => {},
  onItemClose = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrag, setIsDrag] = useState(false);

  const handleToggle = () => {
    if (!isDrag) {
      setIsOpen(!isOpen);
    }
    setIsDrag(false);
  };

  const handleDrag = () => {
    setIsDrag(true);
  };

  const handleAllClose = e => {
    e.stopPropagation();
    if (!isDrag) {
      onCloseAll();
    }
    setIsDrag(false);
  };

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow,
    slidesToScroll: 1,
    vertical: true,
    draggable: false,
    speed: 100,
    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,
  };

  return (
    <Draggable bounds="parent" onDrag={handleDrag}>
      <Wrapper>
        {isOpen && (
          <CustomSlider {...settings} style={{ width: '4.38rem' }}>
            {roomList.map(roomInfo => (
              <ChatItem
                key={roomInfo.id}
                roomInfo={roomInfo}
                onItemClick={onItemClick}
                onItemClose={onItemClose}
              />
            ))}
          </CustomSlider>
        )}

        <ToggleButton visible={visible} onClick={handleToggle}>
          <ChattingIcon width={2.69} height={1.88} />
          {roomList.length ? (
            <div className="close__button" onClick={handleAllClose}>
              <CancelIcon width={0.8} height={0.8} color="#ffffff" />
            </div>
          ) : null}
        </ToggleButton>
      </Wrapper>
    </Draggable>
  );
};

const CustomSlider = styled(Slider)`
  & .slick-slide {
    display: flex;
    justify-content: center;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  right: 30px;
  bottom: 30px;
  padding: 0 0.5rem;
`;

const RoundButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 50%;
  box-shadow: 0 2px 5px #000000;
  cursor: pointer;
  color: #ffffff;
  font-size: 0.69rem;
  position: relative;

  & .close__button {
    display: none;
    align-items: center;
    justify-content: center;
    position: absolute;
    border-radius: 50%;
    bottom: 0;
  }

  &:hover .close__button {
    display: flex;
  }
`;

const ToggleButton = styled(RoundButton)`
  width: 4.38rem;
  height: 4.38rem;
  background: #0b1d41;

  &:hover {
    background: #151559;
  }

  & .close__button {
    width: 2.13rem;
    height: 2.13rem;
  }

  & .close__button:hover {
    background: rgba(11, 29, 65, 0.8);
  }
`;

const ItemWrapper = styled(RoundButton)`
  width: 3.75rem;
  height: 3.75rem;
  background: #6c56e5;
  margin: 0.32rem 0;

  & .close__button {
    width: 1.88rem;
    height: 1.88rem;
  }

  &:hover {
    background: rgba(86, 68, 183, 1);
  }

  & .close__button:hover {
    background: rgba(0, 0, 0, 0.4);
  }
`;

export default FloatingButton;

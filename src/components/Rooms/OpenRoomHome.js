import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Typography, Modal, Badge } from 'antd';
import { Search } from 'teespace-core';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Photos from '../Photos';
import NextArrowIcon from '../../assets/ts_arrow_right_line.svg';
import PrevArrowIcon from '../../assets/ts_arrow_left_line.svg';
import AddIcon from '../../assets/add1.svg';
import Openchat from '../../assets/openchat.svg';
import EnterIcon from '../../assets/enter.svg';
import RoomCreateModal from './RoomCreateModal';

const { Title } = Typography;

function OpenRoomHome({ handleSearchUser, handleOpenChat }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCreateRoom = useCallback(() => {
    setShowCreateModal(c => !c);
  }, []);

  return (
    <StyledModal
      title="오픈 룸 홈"
      visible
      mask={false}
      footer={null}
      closable={true}
      maskClosable={false}
      onCancel={handleOpenChat}
      width="22.5rem"
    >
      <RoomCreateModal visible={showCreateModal} onCancel={handleCreateRoom} />
      <OpenHomeForm>
        <SearchBox>
          <StyledSearch
            className="openhomeinput"
            placeholder="오픈 룸 검색"
            style={{ width: '100%' }}
            onPressEnter={handleSearchUser}
          />
        </SearchBox>
        <RoomListBox>
          <RoomTitle level={5}>
            내 오픈 룸 목록
            <StyledBadge count={'N'} className="site-badge-count-4" />
          </RoomTitle>
          <StyledSlider arrows={true} slidesToShow={4} slidesToScroll={4}>
            <ItemAddBtn onClick={handleCreateRoom}>
              <span>오픈룸 생성</span>
            </ItemAddBtn>
            <Photos srcList={['a1', 'a2', 'a3', 'a4']} defaultDiameter="3.75" />
            <Photos srcList={['a1', 'a2', 'a3', 'a4']} defaultDiameter="3.75" />
            <Photos srcList={['a1', 'a2', 'a3', 'a4']} defaultDiameter="3.75" />
            <Photos srcList={['a1', 'a2', 'a3', 'a4']} defaultDiameter="3.75" />
            <Photos srcList={['a1', 'a2', 'a3', 'a4']} defaultDiameter="3.75" />
            <Photos srcList={['a1', 'a2', 'a3', 'a4']} defaultDiameter="3.75" />
            <Photos srcList={['a1', 'a2', 'a3', 'a4']} defaultDiameter="3.75" />
          </StyledSlider>
        </RoomListBox>
        <RecommendRoomListBox>
          <RoomTitle level={5}>추천 오픈 룸</RoomTitle>
          <RoomList>
            <RoomListItem>
              <Photos
                srcList={['a1', 'a2', 'a3', 'a4']}
                defaultDiameter="2.26"
              />
              <RecomRoomTitle>UX1-1</RecomRoomTitle>
              <RoomJoinBtn>
                <span>참여하기</span>
              </RoomJoinBtn>
              <RoomEnterBtn>
                <span>나가기</span>
              </RoomEnterBtn>
            </RoomListItem>
            <RoomListItem>
              <Photos
                srcList={['a1', 'a2', 'a3', 'a4']}
                defaultDiameter="2.26"
              />
              <RecomRoomTitle>
                안소희, 장윤지, 이소영, 조유섭, 정성욱, 기타등등
              </RecomRoomTitle>
              <RoomJoinBtn>
                <span>참여하기</span>
              </RoomJoinBtn>
              <RoomEnterBtn>
                <span>나가기</span>
              </RoomEnterBtn>
            </RoomListItem>
            <RoomListItem>
              <Photos
                srcList={['a1', 'a2', 'a3', 'a4']}
                defaultDiameter="2.26"
              />
              <RecomRoomTitle>UX1-1</RecomRoomTitle>
              <RoomJoinBtn>
                <span>참여하기</span>
              </RoomJoinBtn>
              <RoomEnterBtn>
                <span>나가기</span>
              </RoomEnterBtn>
            </RoomListItem>
            <RoomListItem>
              <Photos
                srcList={['a1', 'a2', 'a3', 'a4']}
                defaultDiameter="2.26"
              />
              <RecomRoomTitle>UX1-1</RecomRoomTitle>
              <RoomJoinBtn>
                <span>참여하기</span>
              </RoomJoinBtn>
              <RoomEnterBtn>
                <span>나가기</span>
              </RoomEnterBtn>
            </RoomListItem>
          </RoomList>
          <RoomSearchForm>
            <SearchTitle>
              ‘<span>안소희</span>’
            </SearchTitle>
            <SearchSubText>검색 결과가 없습니다.</SearchSubText>
          </RoomSearchForm>
        </RecommendRoomListBox>
      </OpenHomeForm>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }
`;
const OpenHomeForm = styled.div`
  width: 100%;
  padding: 0.63rem 0.75rem 0.5rem;
`;
const SearchBox = styled.div`
  .anticon {
    color: #bdc6d3;
  }
  .anticon-search {
    margin-left: 0.63rem;
  }
  &:hover,
  &:focus {
    .anticon {
      color: #000;
    }
  }
  .ant-input {
    padding: 0.38rem 1.88rem;
  }
`;
const StyledSearch = styled(Search)`
  &.openhomeinput {
    height: 1.88rem;
    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: #fff;
      border: 1px solid #6c56e5;
    }
  }
`;
const RoomListBox = styled.div`
  padding: 0.75rem 0 1.25rem;
  margin: 0 0.69rem 0 0.31rem;
  border-bottom: 1px solid #e3e7eb;
`;

const RecommendRoomListBox = styled.div`
  padding: 0.75rem 0.69rem 0 0.31rem;
`;

const RoomList = styled.ul`
  padding: 0.44rem 0 0;
`;

const RoomListItem = styled.li`
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding 0.44rem 0;
`;

const RoomTitle = styled(Title)`
  &.ant-typography {
    position: relative;
    font-size: 0.75rem;
    line-height: 1.13rem;
    color: #000000;
    letter-spacing: 0;
    margin-right: 0.25rem;
    margin-bottom: 0;
  }
`;
const StyledBadge = styled(Badge)`
  position: absolute;
  top: 50%;
  margin-top: -10px;
  opacity: 0.5;
  font-size: 0.75rem;
  color: #000000;
  sup.ant-badge-count {
    background-color: transparent;
    color: #000;
  }
`;
const ItemAddBtn = styled.button`
  height: 3.75rem;
  background-color: transparent;
  border: none;

  span {
    display: inline-block;
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 50%;
    background: #efefef url(${AddIcon}) 50% 50% no-repeat;
    cursor: pointer;
    font-size: 0;
    line-height: 0;
    text-indent: -9999px;
    vertical-align: top;
  }
`;
const RoomSearchForm = styled.div`
  width: 100%;
  height: 100%;
  min-height: 25.81rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
const RecomRoomTitle = styled.p`
  display: inline-block;
  width: 13.56rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.81rem;
  color: #000000;
  letter-spacing: 0;
  margin-right: auto;
  margin-left: 0.63rem;
`;

const SearchTitle = styled.p`
  font-wieght: 500;
  font-size: 0.94rem;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  margin-bottom: 0.63rem;
`;

const SearchSubText = styled.p`
  font-wieght: 400;
  font-size: 0.75rem;
  color: #696969;
  letter-spacing: 0;
  text-align: center;
`;

const RoomJoinBtn = styled.button`
  height: 1rem;
  background-color: transparent;
  border: none;

  span {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url(${Openchat}) 50% 50% no-repeat;
    background-size: 1rem 1rem;
    cursor: pointer;
    font-size: 0;
    line-height: 0;
    text-indent: -9999px;
    vertical-align: top;
  }
`;
const RoomEnterBtn = styled.button`
  height: 1rem;
  background-color: transparent;
  border: none;

  span {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background: url(${EnterIcon}) 50% 50% no-repeat;
    background-size: 1rem 1rem;
    cursor: pointer;
    font-size: 0;
    line-height: 0;
    text-indent: -9999px;
    vertical-align: top;
  }
`;
const StyledSlider = styled(Slider)`
  margin-top: 1.06rem;
  .slick-slide {
    width: 3.75rem;
    height: 3.75rem;
    img {
      border: none;
    }
    div {
      div {
        margin: 0 auto;
      }
    }
  }
  .slick-prev,
  .slick-next {
    width: 1rem;
    height: 1rem;
    top: -1.61rem;
    &:before {
      content: '';
      width: 1rem;
      height: 1rem;
      display: inline-block;
      font-size: 0;
      font-family: none;
      color: transparent;
      background-size: 1rem 1rem;
      background-color: transparent;
    }
  }
  .slick-prev {
    left: auto;
    right: 0.5rem;
    &:before {
      background: url(${PrevArrowIcon}) 0 0 no-repeat;
    }
  }
  .slick-next {
    right: -0.69rem;
    &:before {
      background: url(${NextArrowIcon}) 0 0 no-repeat;
    }
  }
`;

export default OpenRoomHome;

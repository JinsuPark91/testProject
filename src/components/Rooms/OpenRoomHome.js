import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, Modal } from 'antd';
import { Search, useCoreStores } from 'teespace-core';
import { Observer } from 'mobx-react';
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
import PlatformUIStore from '../../stores/PlatformUIStore';

const { Title } = Typography;

const RoomButton = ({ roomInfo, type, onClick }) => {
  const handleJoin = () => {
    onClick(roomInfo);
  };

  const handleExit = () => {
    onClick(roomInfo);
  };

  if (type === 'join') {
    return (
      <RoomJoinBtn onClick={handleJoin}>
        <span>방 참여하기</span>
      </RoomJoinBtn>
    );
  }

  return (
    <RoomEnterBtn onClick={handleExit}>
      <span>방 나가기</span>
    </RoomEnterBtn>
  );
};

function OpenRoomHome({ visible, onCancel }) {
  const initialStates = {
    createModalVisible: false,
    keyword: '',
  };
  const [createModalVisible, setCreateModalVisibie] = useState(
    initialStates.createModalVisible,
  );

  const [keyword, setKeyword] = useState(initialStates.keyword);

  const { roomStore, userStore } = useCoreStores();
  const history = useHistory();

  useEffect(() => {
    if (visible) {
      const fetchOpenRoomList = async () => {
        const res = await roomStore.fetchOpenRoomList(userStore.myProfile.id);
        return res;
      };

      const fetchRecommandOpenRoomList = async () => {
        const res = await roomStore.fetchRecommandRoomList(
          userStore.myProfile.id,
        );
        return res;
      };

      Promise.all([
        fetchOpenRoomList(),
        fetchRecommandOpenRoomList(),
      ]).then(res => console.log(res));
    }
  }, [visible]);

  const handleCreateRoom = useCallback(() => {
    setCreateModalVisibie(true);
  }, []);

  const handleCreateModalOk = roomName => {
    console.log('ROOM NAME : ', roomName);
    setCreateModalVisibie(false);
  };
  const handleCreateModalCancel = () => {
    setCreateModalVisibie(false);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleKeywordChange = e => {
    setKeyword(e.target.value);
  };

  const handleKeywordClear = () => {
    setKeyword(initialStates.keyword);
  };

  const handleJoin = async roomInfo => {
    console.log('ENTER OPEN ROOM : ', roomInfo.id);
  };

  const handleExit = async roomInfo => {
    console.log('EXIT OPEN ROOM : ', roomInfo.id);
    // try {
    //   console.log('RESULT : ', roomInfo.id);
    //   const result = await roomStore.deleteRoomMember({
    //     userId: userStore.myProfile.id,
    //     roomId: roomInfo.id,
    //   });

    //   if (result) {
    //     if (
    //       PlatformUIStore.resourceType === 's' &&
    //       PlatformUIStore.resourceId === roomInfo.id
    //     ) {
    //       const firstRoomId = roomStore.getRoomArray()?.[0].id;
    //       if (firstRoomId) history.push(`/s/${firstRoomId}/talk`);
    //     }
    //   }
    // } catch (e) {
    //   console.log('DELETE ROOM MEMBER ERROR : ', e);
    // }
  };
  const getUserPhotos = memberString => {
    return memberString
      .split(',')
      .splice(0, 4)
      .map(
        userId =>
          `${userStore.getUserProfilePhoto({
            userId,
            size: 'small',
            isLocal: true,
          })}`,
      );
  };

  return (
    <StyledModal
      title="오픈 룸 홈"
      visible={visible}
      footer={null}
      onCancel={handleCancel}
      width="22.5rem"
    >
      <RoomCreateModal
        visible={createModalVisible}
        onOk={handleCreateModalOk}
        onCancel={handleCreateModalCancel}
      />
      <OpenHomeForm>
        <SearchBox>
          <StyledSearch
            className="openhomeinput"
            placeholder="오픈 룸 검색"
            style={{ width: '100%' }}
            onClear={handleKeywordClear}
            onChange={handleKeywordChange}
            value={keyword}
          />
        </SearchBox>
        {!keyword && (
          <RoomListBox>
            <Observer>
              {() => {
                const openRooms = roomStore.getOpenRoomArray();
                const remain = (openRooms.length + 1) % 4;
                const dummyArray = Array.from(
                  Array(remain ? 4 - remain : 0).keys(),
                );

                return (
                  <>
                    <RoomTitle level={5}>
                      내 오픈 룸 목록
                      <RoomCount>{openRooms.length}</RoomCount>
                    </RoomTitle>
                    <StyledSlider arrows slidesToShow={4} slidesToScroll={4}>
                      <ItemAddBtn onClick={handleCreateRoom}>
                        <span>오픈룸 생성</span>
                      </ItemAddBtn>
                      {openRooms.map(openRoom => {
                        return (
                          <OpenRoomItem key={openRoom.id}>
                            <Photos
                              srcList={getUserPhotos(
                                openRoom.memberIdListString,
                              )}
                              defaultDiameter="3.75"
                            />
                            <OpenRoomName style={{ width: '3.75rem' }}>
                              {openRoom.name}
                            </OpenRoomName>
                          </OpenRoomItem>
                        );
                      })}
                      {dummyArray.map(key => {
                        return <div key={key} />;
                      })}
                    </StyledSlider>
                  </>
                );
              }}
            </Observer>
          </RoomListBox>
        )}
        <RecommendRoomListBox>
          <Observer>
            {() => {
              const rooms = roomStore
                // .getOpenRoomArray()
                .getRecommandRoomArray()
                .filter(roomInfo => roomInfo.name.includes(keyword));

              return !keyword || (keyword && rooms.length) ? (
                <>
                  <RoomTitle level={5}>추천 오픈 룸</RoomTitle>
                  <RoomList style={{ height: !keyword ? '15rem' : '25rem' }}>
                    {rooms.map(roomInfo => (
                      <RoomListItem key={roomInfo.id}>
                        <Photos
                          srcList={getUserPhotos(roomInfo.memberIdListString)}
                          defaultDiameter="2.26"
                        />
                        <RecomRoomTitle>{roomInfo.name}</RecomRoomTitle>
                        {roomInfo.isJoinable ? (
                          <RoomButton
                            roomInfo={roomInfo}
                            type="join"
                            onClick={handleJoin}
                          />
                        ) : (
                          <RoomButton
                            roomInfo={roomInfo}
                            type="exit"
                            onClick={handleExit}
                          />
                        )}
                      </RoomListItem>
                    ))}
                  </RoomList>
                </>
              ) : (
                <RoomSearchForm>
                  <SearchTitle>{keyword}</SearchTitle>
                  <SearchSubText>검색 결과가 없습니다.</SearchSubText>
                </RoomSearchForm>
              );
            }}
          </Observer>
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
  height: 30rem;
  padding: 0.63rem 0.75rem 0.5rem;
  overflow: hidden;
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

const OpenRoomItem = styled.div`
  cursor: pointer;
`;

const OpenRoomName = styled.div`
  width: 3.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
`;

const RoomListBox = styled.div`
  padding: 0.75rem 0 1.25rem;
  margin: 0 0.69rem 0 0.31rem;
  border-bottom: 1px solid #e3e7eb;
`;

const RecommendRoomListBox = styled.div`
  padding: 0.75rem 0 0.5rem 0.31rem;
  height: 100%;
`;

const RoomList = styled.ul`
  padding: 0.44rem 0.5rem 0 0;
  overflow-y: auto;
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

const RoomCount = styled.span`
  color: #000;
  opacity: 0.5;
  font-size: 0.75rem;
  margin-left: 0.5rem;
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
  display: flex;
  align-self: center;
  justify-self: center;
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

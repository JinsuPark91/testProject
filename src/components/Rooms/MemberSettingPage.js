/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Checkbox } from 'antd';
import { useHistory } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { useCoreStores, Message, WaplSearch } from 'teespace-core';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { LeaderIcon } from '../Icons';
import RoomAddMemberModal from './RoomAddMemberModal';

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const WIDTH = {
  CHECKBOX: '5%',
  NICK: '10%',
  LOGIN_ID: '20%',
  TEAM: '10%',
  JOB: '10%',
  PHONE: '15%',
  ROLE: '15%',
  BUTTON: '15%',
};

const TableRow = ({
  style,
  isChecked,
  memberInfo,
  onTransferClick,
  onCheckChange,
}) => {
  const isAdmin = memberInfo.role === 'WKS0004';

  const handleClick = () => {
    onTransferClick(memberInfo);
  };

  const handleCheckChange = e => {
    onCheckChange(e, memberInfo);
  };

  const getMemberType = () => {
    switch (memberInfo.grade) {
      case 'member':
        return '멤버';
      case 'admin':
        return '어드민';
      case 'guest':
        return '게스트';
      default:
        return '';
    }
  };

  return useObserver(() => (
    <RowWrapper style={style}>
      <Cell style={{ width: WIDTH.CHECKBOX }}>
        {isAdmin ? (
          <LeaderIcon width={1.13} height={1.13} color="#205855" />
        ) : (
          <Checkbox
            className="check-round"
            checked={isChecked}
            onChange={handleCheckChange}
          />
        )}
      </Cell>
      <Cell style={{ width: WIDTH.NICK }}>{memberInfo.name}</Cell>
      <Cell style={{ width: WIDTH.LOGIN_ID }}>{memberInfo.loginId}</Cell>
      <Cell style={{ width: WIDTH.TEAM }}>{memberInfo.userJob}</Cell>
      <Cell style={{ width: WIDTH.JOB }}>{memberInfo.position}</Cell>
      <Cell style={{ width: WIDTH.PHONE }}>{memberInfo.userPhone}</Cell>
      <Cell style={{ width: WIDTH.ROLE }}>{getMemberType()}</Cell>
      <Cell style={{ width: WIDTH.BUTTON }}>
        <Button
          type="solid"
          size="small"
          onClick={handleClick}
          disabled={isAdmin}
        >
          변경
        </Button>
      </Cell>
    </RowWrapper>
  ));
};

const SubTab = React.memo(({ tabIndex, onChange }) => {
  return (
    <div style={{ marginBottom: '2rem', marginLeft: '6.5rem' }}>
      <SubTabItem
        data-tab-index={0}
        className={tabIndex === 0 ? 'sub-tab--active' : ''}
        onClick={onChange}
      >
        참여 인원
      </SubTabItem>
      <span
        style={{
          borderRight: '1px solid #D0CCC7',
          height: '0.75rem',
          margin: '0 0.63rem',
        }}
      />
      <SubTabItem
        data-tab-index={1}
        className={tabIndex === 1 ? 'sub-tab--active' : ''}
        // onClick={onChange}
      >
        참여 제한 인원
      </SubTabItem>
    </div>
  );
});

const Table = React.memo(
  ({
    members,
    selectedMembers,
    onTransfer,
    onAllCheckChange,
    onCheckChange,
  }) => {
    const tableBodyRef = useRef(null);
    const { userStore } = useCoreStores();
    const myId = userStore.myProfile.id;
    const [listHeight, setListHeight] = useState(0);

    useEffect(() => {
      if (tableBodyRef.current) {
        setListHeight(tableBodyRef.current.offsetHeight);
      }
    }, [tableBodyRef]);

    const isAllChecked = () => {
      const _members = members.filter(member => member.id !== myId);

      if (!_members.length) return false;

      for (let i = 0; i < _members.length; i += 1) {
        if (!selectedMembers.has(_members[i].id)) {
          return false;
        }
      }

      return true;
    };

    return (
      <>
        <TableHeader>
          <HeaderCell style={{ width: WIDTH.CHECKBOX }}>
            <Checkbox
              className="check-round"
              checked={isAllChecked()}
              onChange={onAllCheckChange}
            />
          </HeaderCell>
          <HeaderCell style={{ width: WIDTH.NICK }}>별명</HeaderCell>
          <HeaderCell style={{ width: WIDTH.LOGIN_ID }}>아이디</HeaderCell>
          <HeaderCell style={{ width: WIDTH.TEAM }}>소속</HeaderCell>
          <HeaderCell style={{ width: WIDTH.JOB }}>직위</HeaderCell>
          <HeaderCell style={{ width: WIDTH.PHONE }}>휴대폰 번호</HeaderCell>
          <HeaderCell style={{ width: WIDTH.ROLE }}>스페이스 권한</HeaderCell>
          <HeaderCell style={{ width: WIDTH.BUTTON }}>룸 권한 이양</HeaderCell>
        </TableHeader>
        <TableBody ref={tableBodyRef}>
          <List
            height={listHeight}
            itemCount={members.length}
            itemSize={remToPixel(3.19)}
            width="100%"
          >
            {({ index, style }) => (
              <TableRow
                style={style}
                isChecked={selectedMembers.has(members[index].id)}
                memberInfo={members[index]}
                onTransferClick={onTransfer}
                onCheckChange={onCheckChange}
              />
            )}
          </List>
        </TableBody>
      </>
    );
  },
);

const MemberPage = ({ roomId }) => {
  const { roomStore, userStore } = useCoreStores();
  const myUserId = userStore.myProfile.id;
  const history = useHistory();
  const [states, setStates] = useState({
    keyword: '',
    members: [],
    filteredMembers: [],
    selectedMembers: new Map(),
    memberInfo: null,
    transferVisible: false,
    kickoutVisible: false,
    inviteVisible: false,
  });

  const {
    keyword,
    members,
    filteredMembers,
    selectedMembers,
    memberInfo,
    transferVisible,
    kickoutVisible,
    inviteVisible,
  } = states;

  useEffect(() => {
    try {
      roomStore
        .fetchRoomMemberList({
          myUserId,
          roomId,
        })
        .then(res => setStates({ ...states, members: res }));
    } catch (err) {
      console.log('RoomMember get error', err);
    }
  }, []);

  useEffect(() => {
    if (keyword) {
      setStates({
        ...states,
        filteredMembers: members.filter(member =>
          member?.name?.includes(keyword),
        ),
      });
    } else {
      setStates({
        ...states,
        filteredMembers: members,
      });
    }
  }, [members, keyword]);

  const handleTransferOk = async () => {
    try {
      if (!roomId) throw new Error('Room ID is not exist.');

      await roomStore.updateRoomLeader({
        roomId,
        userId: memberInfo.id,
      });
    } catch (err) {
      console.error('UPDATE ROOM LEADER ERROR : ', err);
    } finally {
      setStates({
        ...states,
        transferVisible: false,
      });
      history.push(`/s/${roomId}/talk`);
    }
  };

  const handleKickout = () => {
    setStates({
      ...states,
      kickoutVisible: true,
    });
  };

  const handleKickoutOK = async () => {
    // TODO : 벌크로 내쫒을수 있어야 함. 너무 느림
    const serviceCalls = Array.from(selectedMembers.values()).map(member =>
      roomStore.deleteRoomMember({
        userId: myUserId,
        roomId,
        memberId: member.id,
      }),
    );

    let _states = { ...states };
    try {
      const [...result] = await Promise.all(serviceCalls);
      const _members = await roomStore.fetchRoomMemberList({
        myUserId,
        roomId,
      });

      _states = { ..._states, members: _members };
    } catch (err) {
      console.log('강퇴 실패 : ', err);
    } finally {
      _states = {
        ..._states,
        selectedMembers: new Map(),
        kickoutVisible: false,
      };

      setStates(_states);
    }
  };

  const handleKickoutCancel = () => {
    setStates({
      ...states,
      kickoutVisible: false,
    });
  };

  const handleTransfer = info => {
    setStates({
      ...states,
      memberInfo: info,
      transferVisible: true,
    });
  };

  const handleAllCheckChange = e => {
    if (e.target.checked) {
      setStates({
        ...states,
        selectedMembers: new Map(
          filteredMembers
            .filter(member => member.id !== myUserId)
            .map(member => [member.id, member]),
        ),
      });
    } else {
      setStates({
        ...states,
        selectedMembers: new Map(),
      });
    }
  };

  const handleCheckChange = (e, member) => {
    if (e.target.checked) {
      selectedMembers.set(member.id, member);
      setStates({ ...states, selectedMembers: new Map(selectedMembers) });
    } else {
      selectedMembers.delete(member.id);
      setStates({ ...states, selectedMembers: new Map(selectedMembers) });
    }
  };

  const handleTransferCancel = () => {
    setStates({
      ...states,
      transferVisible: false,
    });
  };

  const handleSearchClear = () => {
    setStates({
      ...states,
      keyword: '',
    });
  };

  const handleSearchEnterPress = e => {
    setStates({
      ...states,
      keyword: e.target.value,
    });
  };

  const handleInvite = () => {
    setStates({ ...states, inviteVisible: true });
  };

  const handleInviteOk = async () => {
    let _states = { ...states };
    try {
      const _members = await roomStore.fetchRoomMemberList({
        myUserId,
        roomId,
      });
      _states = { ..._states, members: _members };
    } catch (err) {
      console.log('RoomMember get Error', err);
    } finally {
      setStates({ ..._states, inviteVisible: false });
    }
  };

  const handleInviteCancel = () => {
    setStates({ ...states, inviteVisible: false });
  };

  return (
    <>
      <RoomAddMemberModal
        visible={inviteVisible}
        roomId={roomId}
        onInviteUsers={handleInviteOk}
        onCancel={handleInviteCancel}
      />

      <Message
        visible={transferVisible}
        title={`${memberInfo?.name}님을 룸 관리자로 지정하시겠습니까?`}
        subtitle={
          '기존의 룸 관리자는 멤버로 권한 변경되며\n이후 룸 설정에 접근할 수 없습니다'
        }
        type="error"
        btns={[
          {
            type: 'solid',
            shape: 'round',
            text: '확인',
            onClick: handleTransferOk,
          },
          {
            type: 'outlined',
            shape: 'round',
            text: '취소',
            onClick: handleTransferCancel,
          },
        ]}
      />

      <Message
        visible={kickoutVisible}
        title="해당 인원을 강제 퇴장시키시겠습니까?"
        subtitle="강제 퇴장 멤버는 참여 제한 인원에서 관리할 수 있습니다."
        type="error"
        btns={[
          {
            type: 'solid',
            shape: 'round',
            text: '확인',
            onClick: handleKickoutOK,
          },
          {
            type: 'outlined',
            shape: 'round',
            text: '취소',
            onClick: handleKickoutCancel,
          },
        ]}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '0.63rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.81rem',
              fontWeight: '600',
              margin: '0 1.25rem',
            }}
          >
            참여{' '}
            <span style={{ color: 'rgb(87, 66, 200)' }}>
              {filteredMembers.length}
            </span>
            명
          </span>
          <Button
            type="solid"
            size="small"
            style={{ backgroundColor: '#205855', marginRight: '0.5rem' }}
            onClick={handleInvite}
          >
            + 룸 구성원 초대
          </Button>
          <Button
            type="outlined"
            size="small"
            onClick={handleKickout}
            disabled={!selectedMembers.size}
          >
            강제 퇴장
          </Button>
        </div>
        <div style={{ width: '13.31rem' }}>
          <WaplSearch
            type="default"
            searchIconColor={{ active: '#7C7670', default: '#CAC4BD' }}
            placeholder="별명, 소속, 직위 검색"
            onClear={handleSearchClear}
            onEnterDown={handleSearchEnterPress}
            isCountExist={false}
          />
        </div>
      </div>

      <Table
        members={filteredMembers}
        selectedMembers={selectedMembers}
        onTransfer={handleTransfer}
        onAllCheckChange={handleAllCheckChange}
        onCheckChange={handleCheckChange}
      />
    </>
  );
};

const BlockedMemberPage = () => {
  return <div>Blocked Memeber</div>;
};

const MemberSettingPage = ({ roomId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const changeSubTab = e => {
    setTabIndex(parseInt(e.target.dataset.tabIndex, 10));
  };

  return (
    <Wrapper style={{ height: '100%', padding: '0 0.88rem 0.88rem 0.88rem' }}>
      <SubTab tabIndex={tabIndex} onChange={changeSubTab} />
      {tabIndex === 0 ? (
        <MemberPage roomId={roomId} />
      ) : (
        <BlockedMemberPage roomId={roomId} />
      )}
    </Wrapper>
  );
};

export default MemberSettingPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e3e7eb;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 2rem;
  border-bottom: 1px solid #232d3b;
`;

const TableBody = styled.div`
  height: 100%;
`;

const Cell = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 0.5rem;
  font-size: 0.81rem;
`;

const HeaderCell = styled(Cell)`
  color: #75757f;
  font-size: 0.75rem;
`;

const SubTabItem = styled.span`
  font-size: 0.69rem;
  color: #828282;
  cursor: pointer;

  &.sub-tab--active {
    color: #205855;
    font-weight: 600;
  }
`;

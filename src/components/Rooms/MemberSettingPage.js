import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Checkbox } from 'antd';
import { useHistory } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { useCoreStores, Message } from 'teespace-core';
import { useObserver } from 'mobx-react';
import { LeaderIcon } from '../Icons';

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

const TableRow = ({ style, memberInfo, onTransferClick }) => {
  const isAdmin = memberInfo.role === 'WKS0004';

  const handleClick = () => {
    onTransferClick(memberInfo);
  };

  return useObserver(() => (
    <RowWrapper style={style}>
      <Cell style={{ width: WIDTH.CHECKBOX }}>
        {isAdmin ? (
          <LeaderIcon width={1.13} height={1.13} color="#205855" />
        ) : // <Checkbox className="check-round" />
        null}
      </Cell>
      <Cell style={{ width: WIDTH.NICK }}>{memberInfo.name}</Cell>
      <Cell style={{ width: WIDTH.LOGIN_ID }}>{memberInfo.loginId}</Cell>
      <Cell style={{ width: WIDTH.TEAM }}>{memberInfo.userJob}</Cell>
      <Cell style={{ width: WIDTH.JOB }}>{memberInfo.position}</Cell>
      <Cell style={{ width: WIDTH.PHONE }}>{memberInfo.userPhone}</Cell>
      <Cell style={{ width: WIDTH.ROLE }}>
        {memberInfo.role === 'WKS0004' ? '어드민' : '멤버'}
      </Cell>
      <Cell style={{ width: WIDTH.BUTTON }}>
        <Button
          type="solid"
          size="small"
          onClick={handleClick}
          disabled={isAdmin}
        >
          이양
        </Button>
      </Cell>
    </RowWrapper>
  ));
};

const MemberSettingPage = ({ members, roomId }) => {
  const { roomStore } = useCoreStores();
  const history = useHistory();
  const tableBodyRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [memberInfo, setMemberInfo] = useState(null);
  const [trasferVisible, setTransferVisible] = useState(false);

  useEffect(() => {
    if (tableBodyRef.current) {
      setListHeight(tableBodyRef.current.offsetHeight);
    }
  }, [tableBodyRef]);

  const handleTransferClick = info => {
    setMemberInfo(info);
    setTransferVisible(true);
  };

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
      setTransferVisible(false);
      history.push(`/s/${roomId}/talk`);
    }
  };

  const handleTransferCancel = () => {
    setTransferVisible(false);
  };

  return useObserver(() => (
    <Wrapper style={{ height: '100%', padding: '0 0.75rem 0.75rem 0.75rem' }}>
      <Message
        visible={trasferVisible}
        title={`${memberInfo?.name}님을 룸 관리자로 지정하시겠습니까?`}
        subtitle={`기존의 룸 관리자는 멤버로 권한 변경되며
            이후 룸 설정에 접근할 수 없습니다.`}
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
      <TableHeader>
        <HeaderCell style={{ width: WIDTH.CHECKBOX }}>
          {/* <Checkbox className="check-round" /> */}
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
              memberInfo={members[index]}
              roomId={roomId}
              onTransferClick={handleTransferClick}
            />
          )}
        </List>
      </TableBody>
    </Wrapper>
  ));
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
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
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

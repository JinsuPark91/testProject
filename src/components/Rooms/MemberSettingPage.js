import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, Checkbox } from 'antd';
import { FixedSizeList as List } from 'react-window';
import { useCoreStores } from 'teespace-core';
import { LeaderIcon } from '../Icons';

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const TableRow = ({ style, memberInfo, roomId }) => {
  const { roomStore } = useCoreStores();
  const isAdmin = memberInfo.role === 'WKS0004';
  const handleClick = async () => {
    console.log(memberInfo, roomId);
    await roomStore.updateRoomLeader({
      roomId,
      userId: memberInfo.id,
    });
  };
  return (
    <RowWrapper style={style}>
      {isAdmin ? (
        <LeaderIcon width={1.13} height={1.13} color="#205855" />
      ) : (
          <Checkbox className="check-round" />
        )}
      <span>{memberInfo.name}</span>
      <span>{memberInfo.loginId}</span>
      <span>{memberInfo.role === 'WKS0004' ? '어드민' : '멤버'}</span>
      <Button
        type="solid"
        size="small"
        onClick={handleClick}
        disabled={isAdmin}
      >
        이양
      </Button>
    </RowWrapper>
  );
};

const MemberSettingPage = ({ members, roomId }) => {
  const tableBodyRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (tableBodyRef.current) {
      setListHeight(tableBodyRef.current.offsetHeight);
    }
  }, [tableBodyRef]);

  return (
    <Wrapper style={{ height: '100%', padding: '0 0.75rem 0.75rem 0.75rem' }}>
      <TableHeader>header</TableHeader>
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
            />
          )}
        </List>
      </TableBody>
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

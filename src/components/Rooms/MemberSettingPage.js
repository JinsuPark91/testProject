import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FixedSizeList as List } from 'react-window';

const testData = [
  { id: 1, name: '장윤지1', num: '010-1111-2222' },
  { id: 2, name: '장윤지2', num: '010-1111-2222' },
  { id: 3, name: '장윤지3', num: '010-1111-2222' },
  { id: 4, name: '장윤지4', num: '010-1111-2222' },
  { id: 5, name: '장윤지5', num: '010-1111-2222' },
  { id: 6, name: '장윤지6', num: '010-1111-2222' },
  { id: 7, name: '장윤지7', num: '010-1111-2222' },
  { id: 8, name: '장윤지8', num: '010-1111-2222' },
  { id: 9, name: '장윤지9', num: '010-1111-2222' },
  { id: 10, name: '장윤지10', num: '010-1111-2222' },
  { id: 11, name: '장윤지11', num: '010-1111-2222' },
  { id: 12, name: '장윤지12', num: '010-1111-2222' },
  { id: 13, name: '장윤지13', num: '010-1111-2222' },
];

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const TableRow = ({ style, userInfo }) => {
  const { id, name, num } = userInfo;
  return (
    <div style={style}>
      <span>{id}</span>
      <span>{name}</span>
      <span>{num}</span>
    </div>
  );
};

const MemberSettingPage = () => {
  const tableBodyRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (tableBodyRef.current) {
      console.log('Height : ', tableBodyRef.current.offsetHeight);
      setListHeight(tableBodyRef.current.offsetHeight);
    }
  }, [tableBodyRef]);
  return (
    <Wrapper style={{ height: '100%', padding: '0 0.75rem 0.75rem 0.75rem' }}>
      <TableHeader>header</TableHeader>
      <TableBody ref={tableBodyRef}>
        <List
          height={listHeight}
          itemCount={testData.length}
          itemSize={remToPixel(3.19)}
          width="100%"
        >
          {({ index, style }) => {
            return <TableRow style={style} userInfo={testData[index]} />;
          }}
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

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
  border-bottom: 1px solid #232d3b;
`;

const TableBody = styled.div`
  height: 100%;
`;

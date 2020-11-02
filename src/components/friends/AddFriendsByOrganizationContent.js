import React, { useCallback } from 'react';
import styled from 'styled-components';
import { AutoSizer, List } from 'react-virtualized';
import { Row, Col, Typography } from 'antd';
import FriendItem from './FriendItem';

const { Text } = Typography;

const Wrapper = styled.div``;

const Centered = styled(Col)`
  text-align: center;
`;

function AddFriendsByOrganizationContent({ orgUserList = [] }) {
  const rowRender = useCallback(
    ({ index, key, style }) => {
      const itemStyle = { ...style };
      delete itemStyle.width;
      return (
        <FriendItem
          style={itemStyle}
          friendInfo={orgUserList[index]}
          key={key}
          mode="addFriend"
        />
      );
    },
    [orgUserList],
  );
  return (
    <Wrapper>
      <Row align="middle" style={{ flexGrow: 1 }} justify="center">
        <Col span={24} style={{ height: 300 }}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                overscanRowCount={10}
                style={{ outline: 'none' }}
                rowCount={orgUserList.length}
                height={height}
                width={width}
                rowHeight={74}
                rowRenderer={rowRender}
                scrollToIndex={0}
              />
            )}
          </AutoSizer>
        </Col>
        <Centered>
          {orgUserList.length === 0 && (
            <Text type="secondary">조직원이 없습니다.</Text>
          )}
        </Centered>
      </Row>
    </Wrapper>
  );
}

export default React.memo(AddFriendsByOrganizationContent);

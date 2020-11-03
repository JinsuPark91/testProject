import React, { useEffect, useCallback } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import { Row, Col, Typography } from 'antd';
import styled from 'styled-components';
import { useCoreStores, Switch } from 'teespace-core';
import { useObserver } from 'mobx-react';
import FriendItem from './FriendItem';
import noneRecommendFriendImage from '../../assets/none_recommend_friend.svg';

const { Title, Text } = Typography;

const RecommendTitle = styled(Title)`
  font-size: 0.8125rem !important;
`;

const RecommendSubTitle = styled(Text)`
  font-size: 0.75rem !important;
  color: #8d8d8d;
`;

const NegativeMarginWrapper = styled.div`
  margin: -1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div``;

const Centered = styled.div`
  text-align: center;
`;

const RecommendRow = styled(Row)`
  background-color: #f5f5fb;
  padding: 1.25rem;
`;

const BackgroundImage = styled.div`
  background: url(${noneRecommendFriendImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  width: 100%;
  height: 200px;
`;
function AddFriendsByRecommendationContent() {
  const { friendStore } = useCoreStores();
  const rowRender = useCallback(
    ({ index, key, style }) => {
      const itemStyle = { ...style };
      delete itemStyle.width;
      return (
        <FriendItem
          style={itemStyle}
          friendInfo={friendStore.recommendedFriendInfoList[index]}
          key={key}
          mode="recommended"
        />
      );
    },
    [friendStore.recommendedFriendInfoList],
  );
  return useObserver(() => (
    <NegativeMarginWrapper>
      <RecommendRow>
        <Col span={12}>
          <RecommendTitle level={4}>추천 프렌즈 허용</RecommendTitle>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Switch />
        </Col>
        <Col span={24}>
          <RecommendSubTitle>
            내가 알 수도 있는 프렌즈를 추천받고 다른 프렌즈에 나를 추천해줍니다.
          </RecommendSubTitle>
        </Col>
      </RecommendRow>
      <Wrapper>
        <Row align="middle" style={{ flexGrow: 1 }} justify="center">
          <Col span={24} style={{ height: 300 }}>
            <AutoSizer>
              {({ width, height }) => (
                <List
                  overscanRowCount={10}
                  style={{ outline: 'none' }}
                  rowCount={friendStore.recommendedFriendInfoList.length}
                  height={height}
                  width={width}
                  rowHeight={74}
                  rowRenderer={rowRender}
                  scrollToIndex={0}
                />
              )}
            </AutoSizer>
            {friendStore.recommendedFriendInfoList.length === 0 && (
              <Centered>
                <Title level={4}>추천 프렌즈가 없습니다.</Title>
                <BackgroundImage />
              </Centered>
            )}
          </Col>
        </Row>
      </Wrapper>
    </NegativeMarginWrapper>
  ));
}
export default AddFriendsByRecommendationContent;

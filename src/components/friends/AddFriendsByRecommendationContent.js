import React, { useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import styled from 'styled-components';
import { useCoreStores, Switch } from 'teespace-core';
import { useObserver } from 'mobx-react';
import FriendItem from './FriendItem';
import noneRecommendFriendImage from '../../assets/none_recommend_friend.svg';

const { Title, Text } = Typography;

const RecommendTitle = styled(Title)`
  font-size: 13px !important;
`;

const RecommendSubTitle = styled(Text)`
  font-size: 12px !important;
  color: #8d8d8d;
`;

const NegativeMarginWrapper = styled.div`
  margin: -16px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  margin: 0 0.75rem 4px 0.75rem;
`;

const Centered = styled.div`
  text-align: center;
`;

const RecommendRow = styled(Row)`
  background-color: #f5f5fb;
  padding: 20px;
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
  const { friendStore, authStore } = useCoreStores();
  useEffect(() => {
    friendStore.getRecommendedFriendInfoList({ userId: authStore.user.id });
  }, [authStore.user.id, friendStore]);
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
        <Row
          align="middle"
          style={{ flexGrow: 1, overflow: 'auto' }}
          justify="center"
        >
          <Col span={24}>
            {friendStore.recommendedFriendInfoList.map(item => (
              <FriendItem friendInfo={item} key={item.id} mode="recommended" />
            ))}
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

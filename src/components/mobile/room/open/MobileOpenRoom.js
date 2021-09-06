import React, { useState, useEffect, useContext } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import { Observer } from 'mobx-react';
import { FixedSizeList as List } from 'react-window';
import { useCoreStores } from 'teespace-core';
import MobileOpenRoomHeader from './MobileOpenRoomHeader';
import MobileMyOpenRoomItem from './MobileMyOpenRoomItem';
import MobileOpenRoomItem from './MobileOpenRoomItem';
import MobileLoader from '../../MobileLoader';
import { remToPixel } from '../../../../utils/GeneralUtil';
import { AddIcon } from '../../../Icons';

const MobileOpenRoom = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const themeContext = useContext(ThemeContext);
  const { roomStore, userStore } = useCoreStores();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      await roomStore.fetchOpenRoomList();
      setLoading(false);
    };
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => history.push(`/openoption`);

  if (loading) return <MobileLoader />;

  // 3 + 0.75 + 1.13 + 1.26 + 2.25 + 0.69 + 1.13 + 1.435
  const otherHeight = remToPixel(12);
  const height = window.innerHeight - otherHeight;

  return (
    <>
      <MobileOpenRoomHeader />
      <MyContentWrapper>
        <Observer>
          {() => {
            const myOpenRoom = roomStore
              .getOpenRoomArray()
              .filter(
                roomInfo =>
                  roomInfo.adminId === userStore.myProfile.id &&
                  roomInfo.isJoined,
              );

            return (
              <>
                <Title>
                  <Trans
                    i18nKey="CM_OPEN_ROOM_HOME_03"
                    components={{
                      style: <MyCount />,
                    }}
                    values={{ num: myOpenRoom.length }}
                  />
                </Title>
                <MyList>
                  <div>
                    <AddBtn onClick={handleCreate}>
                      <AddIcon
                        width="0.68"
                        height="0.68"
                        color={themeContext.IconNormal}
                      />
                    </AddBtn>
                  </div>
                  {myOpenRoom.map(elem => (
                    <MobileMyOpenRoomItem key={elem.id} roomInfo={elem} />
                  ))}
                </MyList>
              </>
            );
          }}
        </Observer>
      </MyContentWrapper>
      <ContentWrapper>
        <OpenTitle>
          <Title>{t('CM_OPEN_ROOM_HOME_04')}</Title>
        </OpenTitle>
        <Observer>
          {() => {
            const openRoomList = roomStore.getOpenRoomArray();

            return (
              <List
                height={height}
                itemCount={openRoomList.length}
                itemSize={remToPixel(3)}
                width="100%"
              >
                {({ index, style }) => {
                  return (
                    <MobileOpenRoomItem
                      key={index}
                      roomInfo={openRoomList[index]}
                      style={style}
                    />
                  );
                }}
              </List>
            );
          }}
        </Observer>
      </ContentWrapper>
    </>
  );
};

export default MobileOpenRoom;

const MyContentWrapper = styled.div`
  padding: 0.75rem 1rem 0 1rem;
`;

const ContentWrapper = styled.div`
  padding: 0 0 0 1rem;
`;

const Title = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.13rem;
  color: ${theme => theme.TextMain};
`;

const MyCount = styled.span`
  margin-left: 0.38rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.TextSub2};
`;

const MyList = styled.div`
  display: flex;
  padding: 0.63rem 0;
  border-bottom: 1px solid #dddee7;
  overflow: auto;
`;

const AddBtn = styled.button`
  position: relative;
  width: 2.25rem !important;
  height: 2.25rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.SubStateNormal};
  border: none;
  vertical-align: top;
  font-size: 0;
  line-height: 0;
  text-indent: -9999px;
  cursor: pointer;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const OpenTitle = styled.div`
  margin: 1rem 0 0.435rem 0;
`;

const Loader = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  user-select: none;

  & img {
    width: 5rem;
    height: auto;
  }
`;

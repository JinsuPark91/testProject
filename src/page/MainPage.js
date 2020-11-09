import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import LeftSide from '../components/main/LeftSide';
import MainSide from '../components/main/MainSide';
import { Wrapper } from './MainPageStyle';
import PlatformUIStore from '../stores/PlatformUIStore';

const useQueryParams = (searchParams = window.location.search) => {
  return Object.fromEntries(new URLSearchParams(searchParams));
};

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();
  const { resourceType, resourceId, mainApp } = useParams();
  const { sub: subApp } = useQueryParams(history.location.search);

  useEffect(() => {
    Promise.all([PlatformUIStore.getRooms(), PlatformUIStore.getUsers()]).then(
      () => {
        setIsLoading(false);
      },
    );
  }, []);

  // 묶어 놓으면, 하나 바뀔때도 다 바뀜
  useEffect(() => {
    PlatformUIStore.resourceType = resourceType;
  }, [resourceType]);

  useEffect(() => {
    PlatformUIStore.resourceId = resourceId;
  }, [resourceId]);

  useEffect(() => {
    PlatformUIStore.mainApp = mainApp;
  }, [mainApp]);

  useEffect(() => {
    PlatformUIStore.subApp = subApp;
    if (!subApp) {
      PlatformUIStore.layout = 'close';
    } else {
      PlatformUIStore.layout = 'collapse';
    }
  }, [subApp]);

  const leftSide = useMemo(() => <LeftSide />, []);
  const mainSide = useMemo(() => <MainSide />, []);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Wrapper>
      {leftSide}
      {mainSide}
    </Wrapper>
  );
};

export default MainPage;

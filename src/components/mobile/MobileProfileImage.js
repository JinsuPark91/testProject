import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCoreStores } from 'teespace-core';
import styled from 'styled-components';
import { Button } from 'antd';
import { CloseIcon } from './Icon';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > img {
    background-color: white;
    width: 100%;
    max-height: 80%;
  }
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 5.31rem;
  padding: 0.06rem 0.25rem 0.06rem 0.25rem;
`;

const ButtonBox = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled(Button)`
  width: 2.75rem;
  height: 2.75rem;
`;

const MobileProfileImage = ({ userId }) => {
  const history = useHistory();
  const { userStore } = useCoreStores();
  const [imageSrc, setImageSrc] = useState(
    userStore.getProfilePhotoURL(userId, 'large'),
  );

  const handleCancel = () => history.push(`/profile/${userId}`);

  const handleError = () => {
    if (imageSrc === userStore.getProfilePhotoURL(userId, 'large'))
      setImageSrc(userStore.getProfilePhotoURL(userId, 'medium'));
  };

  return (
    <Wrapper>
      <Header>
        <ButtonBox onClick={handleCancel}>
          <IconButton type="ghost" icon={<CloseIcon color="#fff" />} />
        </ButtonBox>
      </Header>
      <img alt="profilePhoto" src={imageSrc} onError={handleError} />
    </Wrapper>
  );
};

export default MobileProfileImage;

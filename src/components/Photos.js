import React from 'react';
import styled from 'styled-components';

// TODO : 사진 배치 귀찮
function Photos({ srcList, maxCount }) {
  const srcs = srcList.slice(0, maxCount);
  const width = 30;

  return (
    <Wrapper>
      {srcs.map((src, index) => (
        //   TODO : key 바꿀것 (사진 ID)
        <UserPhoto
          key={index}
          src={src}
          width={width}
          left={index * 5}
          top={index * 5}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 45px;
  height: 45px;
  position: relative;
`;

const UserPhoto = styled.img`
  width: ${props => props.width}px;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  position: absolute;
  background: white;
  border-radius: 50%;
`;

export default Photos;

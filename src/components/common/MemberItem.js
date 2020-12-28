import React from 'react';
import styled from 'styled-components';

const MemberItem = ({ memberInfo, style }) => {
  return (
    <>
      <Style.Item style={style}>
        {memberInfo.isMe && <Style.MyBadge> 나 </Style.MyBadge>}
        <img alt="profile" src={memberInfo.profilePhotoURL} />
        <Style.Name>{memberInfo.name}</Style.Name>
        {memberInfo.isMe && <Style.MyAccount> 내 계정 </Style.MyAccount>}
        {memberInfo.actionItem}
      </Style.Item>
    </>
  );
};

const Style = {
  Item: styled.li`
    display:flex;
    justify-content: space-between;
    align-items: center;
    padding 0.44rem 0;

    & > img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }
  `,

  Name: styled.p`
    display: inline-block;
    width: 13.56rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.81rem;
    color: #000000;
    letter-spacing: 0;
    margin-right: auto;
    margin-left: 0.63rem;
  `,

  MyBadge: styled.span`
    position: absolute;
    top: 0rem;
    text-align: center;
    background-color: #523dc7;
    min-width: 1.06rem;
    min-height: 0.94rem;
    padding: 0.06rem 0.25rem;
    border-radius: 0.28rem;
    font-weight: 600;
    font-size: 0.56rem;
    color: #fff;
    line-height: 0.81rem;
    z-index: 100;
    &:after {
      display: block;
      content: '';
      top: 100%;
      left: 50%;
      border: 0.15rem solid transparent;
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: rgba(136, 183, 213, 0);
      border-top-color: #523dc7;
      margin-left: -0.15rem;
    }
  `,

  MyAccount: styled.span`
    font-size: 0.69rem;
    color: #8d8d8d;
    margin-right: 1rem;
  `,
};

export default MemberItem;

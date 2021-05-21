import React, { useEffect, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { WaplSearch, Toast } from 'teespace-core';
import styled from 'styled-components';
import { Observer } from 'mobx-react';
import { Button, Checkbox } from 'antd';
import { FixedSizeList as List } from 'react-window';
import { useStores } from '../../stores';

const remToPixel = rem => {
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize, 10) * rem
  );
};

const WIDTH = {
  CHECKBOX: '5%',
  NICK: '15%',
  LOGIN_ID: '25%',
  TEAM: '15%',
  JOB: '15%',
  PHONE: '25%',
};

const TableRow = ({ style, member }) => {
  const { roomSettingStore: store } = useStores();
  const handleCheckChange = e => {
    if (e.target.checked) {
      store.selectedBanMembers.set(member.id, member);
    } else {
      store.selectedBanMembers.delete(member.id);
    }
  };

  if (!member) return null;

  return (
    <RowWrapper style={style}>
      <Cell style={{ width: WIDTH.CHECKBOX }}>
        <Observer>
          {() => (
            <Checkbox
              className="check-round"
              checked={store.selectedBanMembers.has(member.id)}
              onChange={handleCheckChange}
            />
          )}
        </Observer>
      </Cell>
      <Observer>
        {() => <Cell style={{ width: WIDTH.NICK }}>{member.nick}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.LOGIN_ID }}>{member.loginId}</Cell>}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.TEAM }}>{member.orgName}</Cell>}
      </Observer>
      <Observer>
        {() => (
          <Cell style={{ width: WIDTH.JOB }}>
            {`${member.job || '-'}/${member.position || '-'}`}
          </Cell>
        )}
      </Observer>
      <Observer>
        {() => <Cell style={{ width: WIDTH.PHONE }}>{member.phone}</Cell>}
      </Observer>
    </RowWrapper>
  );
};

const Table = () => {
  const { t } = useTranslation();
  const { roomSettingStore: store } = useStores();
  const tableBodyRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (tableBodyRef.current) {
      setListHeight(tableBodyRef.current.offsetHeight);
    }
  }, [tableBodyRef]);

  const handleAllCheckChange = e => {
    if (e.target.checked) {
      store.selectedBanMembers.replace(
        new Map(
          store
            .getFilteredMembers({ withoutMe: false })
            .map(member => [member.id, member]),
        ),
      );
    } else {
      store
        .getFilteredMembers({ withoutMe: false })
        .map(member => store.selectedBanMembers.delete(member.id));
    }
  };

  return (
    <>
      <TableHeader>
        <HeaderCell style={{ width: WIDTH.CHECKBOX }}>
          <Observer>
            {() => (
              <Checkbox
                className="check-round"
                checked={store.isAllChecked({ withoutMe: false })}
                onChange={handleAllCheckChange}
              />
            )}
          </Observer>
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.NICK }}>
          {t('CM_NICKNAME')}
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.LOGIN_ID }}>{t('CM_ID')}</HeaderCell>
        <HeaderCell style={{ width: WIDTH.TEAM }}>{t('CM_TEAM')}</HeaderCell>
        <HeaderCell style={{ width: WIDTH.JOB }}>
          {t('CM_TITLE_POSITION')}
        </HeaderCell>
        <HeaderCell style={{ width: WIDTH.PHONE }}>
          {t('CM_MOBILE_NUMBER')}
        </HeaderCell>
      </TableHeader>
      <TableBody ref={tableBodyRef}>
        <Observer>
          {() => {
            const filteredMembers = store.getFilteredMembers({
              withoutMe: false,
            });

            return (
              <List
                height={listHeight}
                itemCount={filteredMembers.length}
                itemSize={remToPixel(3.19)}
                width="100%"
              >
                {({ index, style }) => (
                  <TableRow style={style} member={filteredMembers[index]} />
                )}
              </List>
            );
          }}
        </Observer>
      </TableBody>
    </>
  );
};

const SubWaitingMemberPage = ({ roomId }) => {
  const { t } = useTranslation();
  const { roomSettingStore: store } = useStores();

  // useEffect(() => {
  //   store.fetchBlockedMembers({ roomId });

  //   return () => {
  //     store.members = [];
  //     store.keyword = '';
  //     store.toastMessage = '';
  //     store.toastVisible = '';
  //     store.selectedMembers.clear();
  //   };
  // }, [roomId]);

  const handleUnblock = async () => {
    const userIdList = Array.from(store.selectedBanMembers.keys());
    const result = await store.disableBan({ roomId, userIdList });
    if (result) {
      await store.fetchBlockedMembers({ roomId });
      store.open(
        'toast',
        t('CM_ROOM_SETTING_MANAGE_PEOPLE_04', {
          num: store.selectedBanMembers.size,
        }),
      );
      store.selectedBanMembers.clear();
    }
  };

  const handleSearchClear = () => {
    store.keyword = '';
  };

  const handleSearchEnterPress = e => {
    store.keyword = e.target.value;
  };

  const handleToastClose = () => {
    store.close('toast');
  };

  return (
    <>
      <Observer>
        {() => (
          <Toast
            visible={store.toastVisible}
            timeoutMs={1000}
            onClose={handleToastClose}
          >
            {store.toastMessage}
          </Toast>
        )}
      </Observer>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: '0.63rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.81rem',
              fontWeight: '600',
              margin: '0 1.25rem',
              color: `${props => props.theme.TextMain}`,
            }}
          >
            <Observer>
              {() => (
                <Trans
                  i18nKey="CM_ROOM_SETTING_BLOCK_MANAGE_PEOPLE_02"
                  components={{
                    style: <span style={{ color: '#205855' }} />,
                  }}
                  values={{
                    num: store.getFilteredMembers({ withoutMe: false }).length,
                  }}
                />
              )}
            </Observer>
          </span>
          <Observer>
            {() => {
              const isEmpty = !store.selectedBanMembers.size;
              const style = { marginRight: '0.5rem' };
              if (!isEmpty) {
                style.backgroundColor = '#205855';
              }

              return (
                <Button
                  type="solid"
                  size="small"
                  style={style}
                  onClick={handleUnblock}
                  disabled={isEmpty}
                >
                  {t('CM_ROOM_SETTING_BLOCK_MANAGE_PEOPLE_03')}
                </Button>
              );
            }}
          </Observer>
        </div>
        <div style={{ width: '13.31rem' }}>
          <WaplSearch
            type="default"
            searchIconColor={{ active: '#7C7670', default: '#CAC4BD' }}
            placeholder={t('CM_NICKNAME_TEAM_TITLE_SEARCH')}
            onClear={handleSearchClear}
            onEnterDown={handleSearchEnterPress}
            isCountExist={false}
          />
        </div>
      </div>
      <Table />
    </>
  );
};

export default SubWaitingMemberPage;

const RowWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e3e7eb;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 2rem;
  border-bottom: 1px solid #232d3b;
`;

const TableBody = styled.div`
  height: 100%;
`;

const Cell = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 0.5rem;
  font-size: 0.81rem;
`;

const HeaderCell = styled(Cell)`
  color: #75757f;
  font-size: 0.75rem;
`;

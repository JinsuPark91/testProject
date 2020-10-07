import React from 'react';
import styled, { css } from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { Progress, Typography } from 'antd';

const { Text } = Typography;

const Wrapper = styled.div`
  border: 1px solid #e0e5e9;
  border-radius: 8px;
  height: 42px;
  padding: 4px 4px 0 4px;
  display: inline-flex;
  ${props =>
    props.closable
      ? css`
          width: 220px;
        `
      : css`
          width: 200px;
        `}
`;

const IconArea = styled.div`
  ${props =>
    props.deleted
      ? css`
          margin: 0 2px 2px 2px;
        `
      : css`
          margin: 2px;
        `}
  border-radius: 6px;
  width: 30px;
  height: 30px;
  margin-right: 6px;
`;

const TextWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const AttachmentTitle = styled.div`
  font-size: 11px;
  color: #45474a;
  line-height: 15px;
  height: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const AttachmentSubTitle = styled.div`
  color: #888d96;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AttachmentClose = styled(CloseOutlined)`
  cursor: pointer;
  margin: 4px 0;
  font-size: 9px;
`;

const AttachmentBarProgress = styled(Progress)`
  border-radius: 2px;
  margin-top: auto;
  .ant-progress-outer {
    justify-content: flex-end;
    display: flex;
  }
`;

/**
 * Common Attachment
 * @param {Object}  props
 * @param {boolean} props.closable
 * @param {string}  props.title
 * @param {string}  props.subtitle
 * @param {boolean} props.deleted
 * @param {boolean} props.bigsize
 * @param {number}  props.progress
 * @param {boolean} props.downloading
 * @param {function} props.onClose
 */
function Attachment(props) {
  const {
    title,
    closable,
    subtitle,
    deleted,
    bigsize,
    progress,
    downloading,
    onClose,
  } = props;
  const ext = (title || '').split('.').slice(-1).pop().toLowerCase().trim();

  const ext2path = fileExtension => {
    switch (fileExtension) {
      case 'toc':
      case 'doc':
      case 'docx':
        return 'toword';
      case 'ppt':
      case 'pptx':
        return 'topoint';
      case 'xls':
      case 'xlsx':
        return 'tocell';
      case 'txt':
        return 'text';
      case '7z':
      case 'zip':
        return 'zip';
      case 'hwp':
        return 'tohanhul';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'bmp':
      case 'tiff':
      case 'gif':
      case 'ai':
      case 'eps':
        return 'image';
      case 'avi':
      case 'mp4':
      case 'mkv':
      case 'mov':
      case 'wmv':
      case 'flv':
        return 'movie';
      case 'pdf':
        return 'pdf';
      case 'wav':
      case 'wma':
      case 'aac':
      case 'mp3':
      case 'ogg':
      case 'flac':
      case 'au':
        return 'audio';
      default:
        return 'etc';
    }
  };

  const iconPath = deleted
    ? `/${ext2path(ext)}_delete.svg`
    : `/${ext2path(ext)}.svg`;

  return (
    <Wrapper closable={closable}>
      <IconArea deleted={deleted}>
        {(bigsize || !downloading) && (
          <img src={iconPath} alt={ext2path(ext)} />
        )}
        {!bigsize && downloading && (
          <Progress
            type="circle"
            percent={progress || 0}
            width={30}
            trailColor="#E3E4E9"
            strokeColor="#6C56E5"
          />
        )}
      </IconArea>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginRight: 4,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <TextWrapper>
            <AttachmentTitle>{title}</AttachmentTitle>
            <AttachmentSubTitle>{subtitle}</AttachmentSubTitle>
          </TextWrapper>
          {closable && <AttachmentClose onClick={onClose} />}
        </div>
        {bigsize && downloading && (
          <AttachmentBarProgress
            percent={progress || 0}
            showInfo={false}
            strokeWidth={4}
            trailColor="#E3E4E9"
            strokeColor="#6C56E5"
          />
        )}
      </div>
    </Wrapper>
  );
}

export default Attachment;

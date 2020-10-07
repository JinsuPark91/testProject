import React from 'react';
import CommonAttachment from '../../components/commons/Attachment';

export default {
  title: 'Commons/Attachment',
  component: CommonAttachment,
  argTypes: {
    onClose: {
      action: 'onClose',
    },
    title: {
      type: 'string',
      required: true,
    },
    subtitle: {
      type: 'string',
      required: true,
    },
    deleted: {
      type: 'boolean',
    },
    bigsize: {
      type: 'boolean',
      description:
        'progress바가 전체 너비에 걸쳐서 표시 (downloading이 true일 경우에만 동작)',
    },
    downloading: {
      type: 'boolean',
      description: '다운로드 중임을 표시',
    },
    progress: {
      type: 'number',
    },
  },
  args: {},
};

const Template = props => <CommonAttachment {...props} />;

export const Attachment = Template.bind({});
Attachment.args = { title: 'filename', subtitle: 'subtitle' };

export const AttachmentFormat = Template.bind({});
AttachmentFormat.args = { title: 'filename.pptx', subtitle: 'subtitle' };

export const AttachmentDeleted = Template.bind({});
AttachmentDeleted.args = {
  title: 'filename',
  subtitle: 'subtitle',
  deleted: true,
};

export const AttachmentDownloading = Template.bind({});
AttachmentDownloading.args = {
  title: 'filename',
  subtitle: 'subtitle',
  downloading: true,
  progress: 30,
};
export const AttachmentBigSizeDownloading = Template.bind({});
AttachmentBigSizeDownloading.args = {
  title: 'filename',
  subtitle: 'subtitle',
  bigsize: true,
  downloading: true,
  progress: 30,
};

export const AttachmentClosable = Template.bind({});
AttachmentClosable.args = {
  title: 'filename',
  subtitle: 'subtitle',
  closable: true,
};

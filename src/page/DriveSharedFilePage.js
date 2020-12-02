import React from 'react';
import { useParams } from 'react-router-dom';
import { DriveURLPage } from 'teespace-drive-app';

const DriveSharedFilePage = () => {
  const { fileId } = useParams();
  return <DriveURLPage fileId={fileId} />;
};

export default DriveSharedFilePage;

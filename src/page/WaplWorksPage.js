/* eslint-disable no-underscore-dangle */
import React from 'react';

const WorksApp = React.lazy(() =>
  import('wapl-works').then(module => ({
    default: module.WorksApp,
  })),
);

const WaplWorksPage = () => {
  return <WorksApp />;
};

export default React.memo(WaplWorksPage);

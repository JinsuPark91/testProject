import React from 'react';

export default function MaintenanceGuard({ children }) {
  if (window.env.REACT_APP_MODE === 'maintenance') {
    const hostNameArr = new URL(window.location.href).hostname
      .split('.')
      .slice(1);
    const to = hostNameArr.join('.');
    window.location.href = `https://${to}`;
  }
  return <>{children}</>;
}

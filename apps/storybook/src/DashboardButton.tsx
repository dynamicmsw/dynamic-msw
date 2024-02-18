import { injectDashboardButton } from '@dynamic-msw/dashboard-button';
import { useEffect } from 'react';

export default function DashboardButton() {
  useEffect(() => {
    injectDashboardButton();
  }, []);
  return <div />;
}

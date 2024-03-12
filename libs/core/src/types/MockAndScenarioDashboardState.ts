import { type EntityId } from '@reduxjs/toolkit';
import { type DashboardConfig } from './DashboardConfig';

export default interface MockAndScenarioDashboardState<
  TId extends EntityId | string,
> extends DashboardConfig {
  id: TId;
  isActive?: boolean;
  isExpanded?: boolean;
}

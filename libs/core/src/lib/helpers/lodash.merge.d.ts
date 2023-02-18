import type { DeepPartial } from '../types';

export default function merge<
  TSourceData,
  TUpdateData extends DeepPartial<TSourceData>
>(newData: TUpdateData, sourceData: TSourceData): TUpdateData & TSourceData;

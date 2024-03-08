import { merge, pick } from 'lodash';
import { UnknownObject } from '../types/UnknownObject';

export default function mergeOwnTop<TOwnObject>(
  own: TOwnObject & UnknownObject,
  source: UnknownObject
): TOwnObject {
  const ownKeys = Object.keys(own);
  const pickedFromSource = pick(source, ownKeys);
  return merge(own, pickedFromSource);
}

import { InstantiableType } from '../interfaces';

export const isInstantiableType = (type: unknown): type is InstantiableType => {
  return typeof type === 'function';
};

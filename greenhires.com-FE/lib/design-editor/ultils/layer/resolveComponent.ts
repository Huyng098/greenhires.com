import { LayerComponentProps } from '@lidojs/design-core';
import { JSXElementConstructor } from 'react';
import { resolvers } from '../../editor/resolvers';

export const resolveComponent = (
  comp: string | JSXElementConstructor<LayerComponentProps>
): string => {
  const componentName = typeof comp === 'string' ? 'string' : comp?.name;

  const getNameInResolver = (): string => {
    if (resolvers[componentName]) {
      return componentName;
    }

    for (let i = 0; i < Object.keys(resolvers).length; i++) {
      const name = Object.keys(resolvers)[i];
      const fn = resolvers[name];

      if (fn === comp) {
        return name;
      }
    }

    return comp as string;
  };

  return getNameInResolver();
};

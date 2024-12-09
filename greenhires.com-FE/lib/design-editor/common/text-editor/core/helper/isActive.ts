import { EditorState } from 'prosemirror-state';
import { getSchemaType } from './getSchemaType';
import { isMarkActive } from './isMarkActive';
import { isNodeActive } from './isNodeActive';

export function isActive(
  state: EditorState,
  name: string | null,
  attributes: Record<string, unknown> = {}
): boolean {
  if (!name) {
    return (
      isNodeActive(state, null, attributes) ||
      isMarkActive(state, null, attributes)
    );
  }

  const schemaType = getSchemaType(name, state.schema);

  if (schemaType === 'node') {
    return isNodeActive(state, name, attributes);
  }

  if (schemaType === 'mark') {
    return isMarkActive(state, name, attributes);
  }

  return false;
}

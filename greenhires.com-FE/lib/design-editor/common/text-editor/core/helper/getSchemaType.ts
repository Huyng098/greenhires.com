import { Schema } from 'prosemirror-model';

export function getSchemaType(
  name: string,
  schema: Schema
): 'node' | 'mark' | null {
  if (schema.nodes[name]) {
    return 'node';
  }

  if (schema.marks[name]) {
    return 'mark';
  }

  return null;
}

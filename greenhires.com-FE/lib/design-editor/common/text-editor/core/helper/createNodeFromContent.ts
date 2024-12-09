import { DOMParser, Schema } from 'prosemirror-model';
import { elementFromString } from './elementFromString';

export function createNodeFromContent(content: string, schema: Schema) {
  const parser = DOMParser.fromSchema(schema);

  return parser.parse(elementFromString(content));
}

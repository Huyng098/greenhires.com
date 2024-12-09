import { Schema } from 'prosemirror-model';
import { createNodeFromContent } from './createNodeFromContent';
// import { createNodeFromContent } from './createNodeFromContent.js';

export function createDocument(content: string, schema: Schema) {
  return createNodeFromContent(content, schema);
}

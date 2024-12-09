import { DOMOutputSpec, MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
import BoldSpec from './spec/boldSpec';
import bulletListSpec from './spec/bulletListSpec';
import ItalicSpec from './spec/italicSpec';
import listItemSpec from './spec/listItemSpec';
import ParagraphSpec from './spec/paragraphSpec';
import TextColorSpec from './spec/textColorSpec';
import TextUnderlineSpec from './spec/underlineSpec';

const brDOM: DOMOutputSpec = ['br'];

/// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  /// NodeSpec The top level document node.
  doc: {
    content: 'block+',
  } as NodeSpec,

  /// A plain paragraph textblock. Represented in the DOM
  /// as a `<p>` element.
  paragraph: ParagraphSpec,
  listItem: listItemSpec,
  bulletList: bulletListSpec,

  /// The text node.
  text: {
    group: 'inline',
  } as NodeSpec,
};

export const marks = {
  link: {
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs(dom: HTMLElement) {
          return {
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title'),
          };
        },
      },
    ],
    toDOM(node) {
      const { href, title } = node.attrs;
      return ['a', { href, title }, 0];
    },
  } as MarkSpec,

  italic: ItalicSpec,
  bold: BoldSpec,
  underline: TextUnderlineSpec,
  color: TextColorSpec,
};
export const schema = new Schema({ nodes, marks });

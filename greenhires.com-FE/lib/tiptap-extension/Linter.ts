import { Extension } from "@tiptap/core";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { LinterRange } from "@/interfaces/ai";
import { Command } from "@tiptap/react";
import LinterPlugin from "./LinterPlugin";

function runAllLinterPlugins(doc: ProsemirrorNode, ranges: LinterRange[]) {
  const decorations: [any?] = [];
  ranges.forEach((range) => {
    decorations.push(
      Decoration.inline(range.from, range.to, {
        class: "problem",
      })
    );
  });

  return DecorationSet.create(doc, decorations);
}

export interface LinterOptions {
  plugins: Array<typeof LinterPlugin>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    linter: {
      addLinter: (ranges: LinterRange[]) => ReturnType;
    };
  }
}

export const Linter = Extension.create<LinterOptions>({
  name: "linter",

  addOptions() {
    return {
      plugins: [],
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("linter"),
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, set) {
            const meta = tr.getMeta("linter");
            if (meta && meta.decorations) {
              return meta.decorations;
            }
            return set.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },

  addCommands() {
    return {
      addLinter:
        (ranges: LinterRange[]): Command =>
        ({ state, dispatch }) => {
          if (dispatch) {
            const decorations = runAllLinterPlugins(state.doc, ranges);
            const tr = state.tr.setMeta("linter", { decorations });
            dispatch(tr);
          }
          return true;
        },
    };
  },
});

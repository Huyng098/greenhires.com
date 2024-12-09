import { Plugin } from 'prosemirror-state';
import { TextEditor } from '../../interfaces';

const events = () =>
  new Plugin({
    view() {
      return {
        update: function (view, prevState) {
          const state = view.state;

          if (
            prevState &&
            prevState.doc.eq(state.doc) &&
            prevState.selection.eq(state.selection)
          )
            return;
          if (prevState && !prevState.doc.eq(state.doc)) {
            (view as unknown as TextEditor).events.emit('update', view);
            return;
          }
          (view as unknown as TextEditor).events.emit('selectionUpdate', view);
        },
      };
    },
  });

export default events;

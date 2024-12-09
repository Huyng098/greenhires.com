import { Command } from 'prosemirror-state';
import { setMark } from './setMark';
import { toggleMark } from './toggleMark';
import { unsetMark } from './unsetMark';

export const toggleUnderline: Command = (...params) => {
  return toggleMark('underline')(...params);
};
export const unsetUnderline: Command = (...params) => {
  return unsetMark('underline')(...params);
};
export const setUnderline: Command = (...params) => {
  return setMark('underline')(...params);
};

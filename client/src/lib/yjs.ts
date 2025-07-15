// client/src/lib/yjs.ts (最终稳定版)
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export const ydoc = new Y.Doc();

export const provider = new WebsocketProvider(
  'ws://localhost:1234',
  'sdg-docs-room-final',
  ydoc
);
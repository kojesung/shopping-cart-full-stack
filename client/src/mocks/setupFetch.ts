import { TextDecoder, TextEncoder } from 'util';
import { ReadableStream, TransformStream, WritableStream } from 'stream/web';
import { BroadcastChannel } from 'worker_threads';

Object.assign(global, {
    TextDecoder,
    TextEncoder,
    ReadableStream,
    TransformStream,
    WritableStream,
    BroadcastChannel,
});

const { fetch, Headers, Request, Response } = require('@whatwg-node/fetch');

Object.assign(global, { fetch, Headers, Request, Response });

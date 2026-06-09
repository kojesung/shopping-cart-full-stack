import { beforeAll, afterEach, afterAll } from '@jest/globals';
import { server } from './server';
import { resetStore } from './handlers';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
    server.resetHandlers();
    resetStore();
});
afterAll(() => server.close());

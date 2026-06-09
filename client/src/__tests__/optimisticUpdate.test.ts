import { optimisticUpdate } from '../optimisticUpdate';

describe('optimisticUpdate', () => {
    it('onSuccess가 API 호출 전에 먼저 실행된다', async () => {
        const callOrder: string[] = [];
        const onSuccess = jest.fn(() => callOrder.push('onSuccess'));
        const apiCallFn = jest.fn(() => {
            callOrder.push('apiCallFn');
            return Promise.resolve();
        });

        await optimisticUpdate({ apiCallFn, onSuccess, onError: jest.fn() });

        expect(callOrder).toEqual(['onSuccess', 'apiCallFn']);
    });

    it('API 성공 시 onError가 호출되지 않는다', async () => {
        const onError = jest.fn();

        await optimisticUpdate({
            apiCallFn: () => Promise.resolve(),
            onSuccess: jest.fn(),
            onError,
        });

        expect(onError).not.toHaveBeenCalled();
    });

    it('API 실패 시 onError가 호출된다', async () => {
        const onError = jest.fn();

        await optimisticUpdate({
            apiCallFn: () => Promise.reject(new Error()),
            onSuccess: jest.fn(),
            onError,
        });

        expect(onError).toHaveBeenCalledTimes(1);
    });
});

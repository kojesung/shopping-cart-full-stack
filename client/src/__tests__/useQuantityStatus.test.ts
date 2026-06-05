import { renderHook, act } from '@testing-library/react';
import { useQuantityStatus } from '../hooks/useQuantityStatus';

describe('useQuantityStatus', () => {
    it('increase 호출 시 해당 인덱스 수량이 1 증가한다', () => {
        const { result } = renderHook(() => useQuantityStatus([1, 2, 3]));

        act(() => {
            result.current.increase(1);
        });

        expect(result.current.quantityStatus).toEqual([1, 3, 3]);
    });

    it('decrease 호출 시 해당 인덱스 수량이 1 감소한다', () => {
        const { result } = renderHook(() => useQuantityStatus([1, 2, 3]));

        act(() => {
            result.current.decrease(1);
        });

        expect(result.current.quantityStatus).toEqual([1, 1, 3]);
    });

    it('수량이 99일 때 increase를 호출해도 99를 유지한다', () => {
        const { result } = renderHook(() => useQuantityStatus([99]));

        act(() => {
            result.current.increase(0);
        });

        expect(result.current.quantityStatus).toEqual([99]);
    });

    it('수량이 0일 때 decrease를 호출해도 0을 유지한다', () => {
        const { result } = renderHook(() => useQuantityStatus([0]));

        act(() => {
            result.current.decrease(0);
        });

        expect(result.current.quantityStatus).toEqual([0]);
    });

    it('remove 호출 시 해당 인덱스 항목이 제거된다', () => {
        const { result } = renderHook(() => useQuantityStatus([1, 2, 3]));

        act(() => {
            result.current.remove(1);
        });

        expect(result.current.quantityStatus).toEqual([1, 3]);
    });

    it('initQuantityStatus 호출 시 전달한 배열로 초기화된다', () => {
        const { result } = renderHook(() => useQuantityStatus([1, 2, 3]));

        act(() => {
            result.current.initQuantityStatus([10, 20, 30]);
        });

        expect(result.current.quantityStatus).toEqual([10, 20, 30]);
    });
});

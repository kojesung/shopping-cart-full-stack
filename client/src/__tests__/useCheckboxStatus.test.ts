import { renderHook, act } from '@testing-library/react';
import { useCheckboxStatus } from '../hooks/useCheckboxStatus';

describe('useCheckboxStatus', () => {
    it('toggle 호출 시 해당 인덱스 체크 상태가 반전된다', () => {
        const { result } = renderHook(() => useCheckboxStatus(3));

        act(() => {
            result.current.toggle(1);
        });

        expect(result.current.checkStatus).toEqual([false, true, false]);
    });

    it('전부 체크된 상태에서 toggleAll 호출 시 전체 해제된다', () => {
        const { result } = renderHook(() => useCheckboxStatus(3));

        act(() => {
            result.current.initCheckStatus([true, true, true]);
        });
        act(() => {
            result.current.toggleAll();
        });

        expect(result.current.checkStatus).toEqual([false, false, false]);
    });

    it('일부만 체크된 상태에서 toggleAll 호출 시 전체 선택된다', () => {
        const { result } = renderHook(() => useCheckboxStatus(3));

        act(() => {
            result.current.initCheckStatus([true, false, true]);
        });
        act(() => {
            result.current.toggleAll();
        });

        expect(result.current.checkStatus).toEqual([true, true, true]);
    });

    it('isAllChecked는 전부 true일 때만 true다', () => {
        const { result } = renderHook(() => useCheckboxStatus(3));

        act(() => {
            result.current.initCheckStatus([true, true, true]);
        });
        expect(result.current.isAllChecked).toBe(true);

        act(() => {
            result.current.toggle(0);
        });
        expect(result.current.isAllChecked).toBe(false);
    });

    it('isAllChecked는 빈 배열일 때 false다', () => {
        const { result } = renderHook(() => useCheckboxStatus(0));

        expect(result.current.isAllChecked).toBe(false);
    });

    it('remove 호출 시 해당 인덱스 항목이 제거된다', () => {
        const { result } = renderHook(() => useCheckboxStatus(3));

        act(() => {
            result.current.initCheckStatus([true, false, true]);
        });
        act(() => {
            result.current.remove(1);
        });

        expect(result.current.checkStatus).toEqual([true, true]);
    });

    it('initCheckStatus 호출 시 전달한 배열로 초기화된다', () => {
        const { result } = renderHook(() => useCheckboxStatus(3));

        act(() => {
            result.current.initCheckStatus([true, false, true]);
        });

        expect(result.current.checkStatus).toEqual([true, false, true]);
    });
});

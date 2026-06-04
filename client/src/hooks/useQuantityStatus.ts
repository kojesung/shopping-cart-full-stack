import { useState } from 'react';

// 상품 정보 배열을 받으면 그걸 파싱해서 useState 호출 시점에 초기값으로 넣어줄까
// 아니면 초기값은 0으로 두고 따로 세팅하는 함수를 만들어서 그걸 호출하게 할까

// 현재 상황에서 내린 결론은 호출하는 곳에서 초기값 아예 결정하도록
export const useQuantityStatus = (initialQuantities: number[]) => {
    const [quantityStatus, setQuantityStatus] = useState<number[]>(initialQuantities);

    const increase = (index: number) => {
        setQuantityStatus((prev) => prev.map((quantity, i) => (index === i ? quantity + 1 : quantity)));
    };
    const decrease = (index: number) => {
        setQuantityStatus((prev) => prev.map((quantity, i) => (index === i ? quantity - 1 : quantity)));
    };

    const remove = (index: number) => {
        setQuantityStatus((prev) => prev.filter((_, i) => index !== i));
    };

    const initQuantityStatus = (quantities: number[]) => {
        setQuantityStatus(quantities);
    };

    return { quantityStatus, increase, decrease, remove, initQuantityStatus };
};

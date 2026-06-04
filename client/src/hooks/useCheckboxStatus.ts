import { useState } from 'react';

export const useCheckboxStatus = (productCount: number) => {
    const [checkStatus, setCheckStatus] = useState<boolean[]>(Array.from({ length: productCount }, () => false));

    const toggle = (index: number) => {
        setCheckStatus((prev) => prev.map((status, i) => (index === i ? !status : status)));
    };

    const remove = (index: number) => {
        setCheckStatus((prev) => prev.filter((_, i) => index !== i));
    };

    const initCheckStatus = (statuses: boolean[]) => {
        setCheckStatus(statuses);
    };

    const isAllChecked = checkStatus.length > 0 && checkStatus.every(Boolean);

    const toggleAll = () => {
        setCheckStatus((prev) => {
            const allChecked = prev.every(Boolean);
            return prev.map(() => !allChecked);
        });
    };

    return { checkStatus, isAllChecked, toggle, toggleAll, remove, initCheckStatus };
};

import { useState } from 'react';

export const useCheckboxStatus = (productCount: number) => {
    const [checkStatus, setCheckStatus] = useState<boolean[]>(Array.from({ length: productCount }, () => false));

    const toggle = (index: number) => {
        setCheckStatus((prev) => prev.map((status, i) => (index === i ? !status : status)));
    };

    const remove = (index: number) => {
        setCheckStatus((prev) => prev.filter((_, i) => index !== i));
    };

    return { checkStatus, toggle, remove };
};

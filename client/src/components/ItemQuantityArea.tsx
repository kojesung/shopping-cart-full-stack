import styled from '@emotion/styled';
import type { ReactNode } from 'react';

interface ItemQuantityAreaProps {
    children: ReactNode;
}

export default function ItemQuantityArea({ children }: ItemQuantityAreaProps) {
    return <ItemQuantityAreaStyle>{children}</ItemQuantityAreaStyle>;
}

const ItemQuantityAreaStyle = styled.div`
    display: flex;
    align-items: center;
    gap: 4.5px;
    margin: 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0%;
`;

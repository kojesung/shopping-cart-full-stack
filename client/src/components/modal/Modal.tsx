import styled from '@emotion/styled';
import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
    render: () => ReactNode;
    onClose: () => void;
}

export default function Modal({ render, onClose }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef) dialogRef.current.showModal();
    }, []);

    return (
        <DialogDefaultStyle ref={dialogRef} onClose={onClose}>
            {render()}
        </DialogDefaultStyle>
    );
}

const DialogDefaultStyle = styled.dialog`
    border: none;
    border-radius: 8px;
`;

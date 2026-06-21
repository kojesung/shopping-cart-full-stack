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
        <dialog ref={dialogRef} onClose={onClose}>
            {render()}
        </dialog>
    );
}

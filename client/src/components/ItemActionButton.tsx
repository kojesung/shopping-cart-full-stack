import styled from '@emotion/styled';

type TextChildren = {
    text: string;
    children?: never;
};

type NodeChildren = {
    text?: never;
    children: React.ReactNode;
};

type ItemActionButtonProps = (TextChildren | NodeChildren) & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ItemActionButton({ text, children, onClick }: ItemActionButtonProps) {
    return <ItemActionButtonContainer onClick={onClick}>{text ? text : children}</ItemActionButtonContainer>;
}

const ItemActionButtonContainer = styled.button`
    height: 24px;
    min-width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #0a0d13;
    border: 1px solid #0000001a;
    background-color: #ffffff;
    border-radius: 4px;
`;

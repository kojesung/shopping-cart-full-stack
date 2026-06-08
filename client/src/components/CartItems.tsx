import styled from '@emotion/styled';
import CheckBox from './CheckBox';
import ItemCard from './ItemCard';
import type { Product } from '../api/cartApiService';

interface CartItemsProps {
    products: Product[];
    quantityStatus: number[];
    checkStatus: boolean[];
    isAllChecked: boolean;
    onIncrease: (productId: number) => void;
    onDecrease: (productId: number) => void;
    onToggle: (productId: number) => void;
    onToggleAll: () => void;
    onDelete: (productId: number) => void;
}

export default function CartItems({
    products,
    quantityStatus,
    checkStatus,
    isAllChecked,
    onIncrease,
    onDecrease,
    onToggle,
    onToggleAll,
    onDelete,
}: CartItemsProps) {
    return (
        <CartItemsStyle>
            <CheckBox checkStatus={isAllChecked} handleCheckClick={onToggleAll} />
            {products.map((product, index) => (
                <ItemCard
                    key={product.id}
                    checkStatus={checkStatus[index]}
                    handleCheckboxClick={() => onToggle(product.id)}
                    quantity={quantityStatus[index]}
                    handleQuantityPlusClick={() => onIncrease(product.id)}
                    handleQuantityMinusClick={() => onDecrease(product.id)}
                    product={product}
                    handleDeleteClick={() => onDelete(product.id)}
                />
            ))}
        </CartItemsStyle>
    );
}

const CartItemsStyle = styled.section`
    width: 382px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

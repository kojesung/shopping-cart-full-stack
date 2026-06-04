import styled from '@emotion/styled';
import CheckBox from './CheckBox';
import ItemCard from './ItemCard';
import type { Product } from '../api/cartApiService';

interface CartItemsProps {
    products: Product[];
    quantityStatus: number[];
    checkStatus: boolean[];
    onIncrease: (index: number) => void;
    onDecrease: (index: number) => void;
    onToggle: (index: number) => void;
    onDelete: (index: number) => void;
}

export default function CartItems({
    products,
    quantityStatus,
    checkStatus,
    onIncrease,
    onDecrease,
    onToggle,
    onDelete,
}: CartItemsProps) {
    return (
        <CartItemsStyle>
            <CheckBox checkStatus={false} handleCheckClick={() => null} />
            {products.map((product, index) => (
                <ItemCard
                    key={product.id}
                    checkStatus={checkStatus[index]}
                    handleCheckboxClick={() => onToggle(index)}
                    quantity={quantityStatus[index]}
                    handleQuantityPlusClick={() => onIncrease(index)}
                    handleQuantityMinusClick={() => onDecrease(index)}
                    itemPrice={product.price}
                    itemName={product.name}
                    itemImgUrl={product.imgUrl}
                    handleDeleteClick={() => onDelete(index)}
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

import styled from '@emotion/styled';
import CheckBox from './CheckBox';
import ItemActionButton from './ItemActionButton';
import type { Product } from '../api/cartApiService';

interface ItemCardProps {
    checkStatus: boolean;
    handleCheckboxClick: () => void;
    quantity: number;
    handleQuantityPlusClick: () => void;
    handleQuantityMinusClick: () => void;
    product: Product;
    handleDeleteClick: () => void;
}

export default function ItemCard({
    checkStatus,
    handleCheckboxClick,
    quantity,
    handleQuantityPlusClick,
    handleQuantityMinusClick,
    product,
    handleDeleteClick,
}: ItemCardProps) {
    return (
        <ItemCartStyle>
            <CheckDeleteArea>
                <CheckBox checked={checkStatus} onClick={handleCheckboxClick} />
                <ItemActionButton onClick={handleDeleteClick} text="삭제"></ItemActionButton>
            </CheckDeleteArea>
            <ItemInfoArea>
                <ItemImage src={product.imgUrl} />
                <ItemDetailInfo>
                    <>
                        <ItemName>{product.name}</ItemName>
                        <ItemPrice>{product.price.toLocaleString()}원</ItemPrice>
                    </>
                    <ItemQuantityArea>
                        <ItemActionButton onClick={handleQuantityMinusClick} text="-" disabled={quantity <= 0} />
                        <Quantity>{quantity}</Quantity>
                        <ItemActionButton onClick={handleQuantityPlusClick} text="+" disabled={quantity >= 99} />
                    </ItemQuantityArea>
                </ItemDetailInfo>
            </ItemInfoArea>
        </ItemCartStyle>
    );
}

const ItemCartStyle = styled.div`
    width: 382px;
    height: 160px;
    border-top: 1px solid #000000;
    padding-top: 12px;
    box-sizing: content-box;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const CheckDeleteArea = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const ItemInfoArea = styled.div`
    width: 100%;
    height: 112px;
    display: flex;
    gap: 24px;
`;

const ItemImage = styled.img`
    width: 112px;
    height: 112px;
    border-radius: 8px;
`;

const ItemDetailInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
`;

const ItemName = styled.p`
    margin: 0;
    font-weight: 500;
    font-size: 12px;
    color: #0a0d13;
    line-height: 15px;
`;

const ItemPrice = styled.p`
    margin: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
`;

const ItemQuantityArea = styled.div`
    display: flex;
    align-items: center;
    gap: 4.5px;
`;

const Quantity = styled.p`
    margin: 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0%;
`;

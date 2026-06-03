import styled from '@emotion/styled';
import CheckBox from './CheckBox';

interface ItemCardProps {
    checkStatus: boolean;
    handleCheckboxClick: () => void;
    quantity: number;
    handleQuantityPlusClick: () => void;
    handleQuantityMinusClick: () => void;
    itemPrice: number;
    itemName: string;
    itemImgUrl: string;
    handleDeleteClick: () => void;
}

export default function ItemCard({
    checkStatus,
    handleCheckboxClick,
    quantity,
    handleQuantityPlusClick,
    handleQuantityMinusClick,
    itemPrice,
    itemName,
    itemImgUrl,
    handleDeleteClick,
}: ItemCardProps) {
    return (
        <ItemCartStyle>
            <CheckDeleteArea>
                <CheckBox checkStatus={checkStatus} handleCheckClick={handleCheckboxClick} />
                <button onClick={handleDeleteClick}>삭제</button>
            </CheckDeleteArea>
            <ItemInfoArea>
                <ItemImage src={itemImgUrl} />
                <ItemDetailInfo>
                    <ItemName>{itemName}</ItemName>
                    <ItemPrice>{itemPrice.toLocaleString()}원</ItemPrice>
                    <ItemQuantityArea>
                        <QuantityMinusButton onClick={handleQuantityMinusClick}>-</QuantityMinusButton>
                        <Quantity>{quantity}</Quantity>
                        <QuantityPlusButton onClick={handleQuantityPlusClick}>+</QuantityPlusButton>
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

const ItemName = styled.p``;

const ItemPrice = styled.p``;

const ItemQuantityArea = styled.div``;

const QuantityMinusButton = styled.button``;

const Quantity = styled.p``;

const QuantityPlusButton = styled.button``;

import styled from '@emotion/styled';

export default function ItemCard() {
    return (
        <ItemCartStyle>
            <CheckDeleteArea></CheckDeleteArea>
            <ItemInfoArea>
                <ItemImage />
                <ItemDetailInfo>
                    <ItemName>상품이름A</ItemName>
                    <ItemPrice>35,000워</ItemPrice>
                    <ItemQuantityArea>
                        <QuantityMinusButton>-</QuantityMinusButton>
                        <Quantity>2</Quantity>
                        <QuantityPlusButton>+</QuantityPlusButton>
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

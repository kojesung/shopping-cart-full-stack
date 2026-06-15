import ItemCardLayout from './ItemCardLayout';
import ItemCardStyle from './ItemCardStyle';
import ItemQuantityArea from './ItemQuantityArea';
import type { Product } from '../api/cartApiService';

interface OrderItemCardProps {
    product: Product;
    quantity: number;
}

export default function OrderItemCard({ product, quantity }: OrderItemCardProps) {
    return (
        <ItemCardStyle>
            <ItemCardLayout product={product} quantityArea={<ItemQuantityArea>수량 {quantity}개</ItemQuantityArea>} />
        </ItemCardStyle>
    );
}

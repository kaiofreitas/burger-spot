import { supabase, supabaseConfigured } from '../lib/supabase';
import { CartItem, UserDetails } from '../types';

export async function saveOrder(
  items: CartItem[],
  details: UserDetails,
  deliveryFee: number,
  total: number
): Promise<number | null> {
  if (!supabaseConfigured) return null;

  const subtotal = total - deliveryFee;

  // 1. Insert customer
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .insert({
      name: details.name,
      address: details.address,
      bairro: details.bairro || null,
    })
    .select('id')
    .single();

  if (customerError || !customer) {
    console.error('Failed to save customer:', customerError);
    return null;
  }

  // 2. Insert order (select both id and order_number)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      payment_method: details.payment,
      notes: details.notes || '',
    })
    .select('id, order_number')
    .single();

  if (orderError || !order) {
    console.error('Failed to save order:', orderError);
    return null;
  }

  // 3. Insert order items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        notes: item.notes || '',
      }))
    );

  if (itemsError) {
    console.error('Failed to save order items:', itemsError);
  }

  return order.order_number;
}

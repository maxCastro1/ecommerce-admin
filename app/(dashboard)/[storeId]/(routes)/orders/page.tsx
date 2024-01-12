import prismadb from "@/lib/prismadb"
import { OrderClient } from "./componets/client"
import { OrderColumn } from "./componets/columns";
import { format} from 'date-fns'
import { formatter } from "@/lib/utils";

const OrdersPage = async ({params}: {  params :{storeId: string}}) => {

  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include:{
          product: true
        }
      }
    },
    orderBy: {
      createdSt: 'desc'
    }
  });
  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id : item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + Number(item.product.Price)
    },0 )),
    isPaid: item.isPaid,
    createdAt: format(item.createdSt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <OrderClient data={formattedOrders}/>
        </div>
    </div>
  )
}

export default OrdersPage 
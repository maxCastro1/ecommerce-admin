import prismadb from "@/lib/prismadb"
import { ProductColumn } from "./componets/columns";
import { format} from 'date-fns'
import { formatter } from "@/lib/utils";
import { ProductClient } from "./componets/client";

const ProductsPage = async ({params}: {  params :{storeId: string}}) => {

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
     category: true,
     size: true,
     color: true,
    },
    orderBy: {
      createdSt: 'desc'
    }
  });
  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id : item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchieved: item.isArchieved,
    price: formatter.format(item.Price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdSt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductClient data={formattedProducts}/>
        </div>
    </div>
  )
}

export default ProductsPage 
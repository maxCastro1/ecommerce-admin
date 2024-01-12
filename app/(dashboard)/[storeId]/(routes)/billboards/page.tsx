import prismadb from "@/lib/prismadb"
import { BillboardClient } from "./componets/client"
import { billboardColumn } from "./componets/columns";
import { format} from 'date-fns'

const BillboardsPage = async ({params}: {  params :{storeId: string}}) => {

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdSt: 'desc'
    }
  });
  const formattedBillvoards: billboardColumn[] = billboards.map((item) => ({
    id : item.id,
    label: item.label,
    createdAt: format(item.createdSt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardClient data={formattedBillvoards}/>
        </div>
    </div>
  )
}

export default BillboardsPage 
import prismadb from "@/lib/prismadb"
import { SizeClient } from "./componets/client"
import { SizeColumn } from "./componets/columns";
import { format} from 'date-fns'

const SizesPage = async ({params}: {  params :{storeId: string}}) => {

  const size = await prismadb.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdSt: 'desc'
    },

  });
  const formattedSizes: SizeColumn[] = size.map((item) => ({
    id : item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdSt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SizeClient data={formattedSizes}/>
        </div>
    </div>
  )
}

export default SizesPage 
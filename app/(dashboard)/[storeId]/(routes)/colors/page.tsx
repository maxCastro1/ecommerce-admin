import prismadb from "@/lib/prismadb"
import { ColorsClient } from "./componets/client"
import { ColorsColumn } from "./componets/columns";
import { format} from 'date-fns'

const ColorsPage = async ({params}: {  params :{storeId: string}}) => {

  const size = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdSt: 'desc'
    },

  });
  const formattedColors: ColorsColumn[] = size.map((item) => ({
    id : item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdSt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ColorsClient data={formattedColors}/>
        </div>
    </div>
  )
}

export default ColorsPage 
import prismadb from "@/lib/prismadb"
import { CategoryClient } from "./componets/client"
import { categoryColumn } from "./componets/columns";
import { format} from 'date-fns'

const CategoriesPage = async ({params}: {  params :{storeId: string}}) => {

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdSt: 'desc'
    },

  });
  const formattedCategories: categoryColumn[] = categories.map((item) => ({
    id : item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdSt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryClient data={formattedCategories}/>
        </div>
    </div>
  )
}

export default CategoriesPage 
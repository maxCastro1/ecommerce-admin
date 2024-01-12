"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SizeColumn } from "./columns"
import { Button } from "@/components/ui/modals/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"
import toast from "react-hot-toast"
import { useParams ,useRouter} from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { Alert } from "@/components/ui/alert"
import { AlertModal } from "@/components/ui/modals/alert-modal"

interface CellActionProps {
    data: SizeColumn
}
export const CellAction:React.FC<CellActionProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);


    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Size ID copied to the clipboard.");
        };

     const onDelete = async () => {
            try {
                setLoading(true)
                await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
                router.refresh();
                toast.success("Size deleted")
    
            } catch (error) {
                toast.error("Make sure you removed all products using this size.")
                console.log(error)
            }
            finally {
                setLoading(false)
                setOpen(false)
            }
        }
    return (
    
      <>
      <AlertModal 
      isOpen={open}
      onClose={()=>setOpen(!open)}
      onConfirm={onDelete}
      loading={loading}
      />
      <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                 Actions
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onCopy(data.id)}>
                <Copy className="mr-2 h-4 w-4" />
                 Copy Id
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/sizes/${data.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                 Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=> setOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                 Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </> 
    )
}
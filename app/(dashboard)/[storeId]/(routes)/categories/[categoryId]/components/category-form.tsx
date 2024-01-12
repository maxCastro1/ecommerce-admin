"use client"
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { Button } from "@/components/ui/modals/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/modals/form";
import { Heading } from "@/components/ui/modals/heading";
import { Input } from "@/components/ui/modals/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-orign";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client"
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from 'zod';



interface CategoryFormProps {
    initialData: Category | null
    billboards: Billboard[]
}
const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
})
type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
    

}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const title = initialData ? "Edit Category" : "Create Category"
    const description = initialData ? "Edit category" : "Add a new category"
    const toastMessage = initialData ? "Edit updated." : "category created."
    const action = initialData ? "Save chages." : "Create"
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
          
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }

            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success(toastMessage)
        } catch (error) {
            console.log(error)
            toast.error("something went wrong.");
        } finally {
            setLoading(false)
        }
    }
    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success("Category deleted")

        } catch (error) {
            toast.error("Make sure you removed all products using this categories.")
        }
        finally {
            setLoading(false)
            setOpen(false)
        }
    }
    return (
        <>
            <AlertModal isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && <Button
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>}

            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                           control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Category name" {...field} />
                                    </FormControl>
                                </FormItem>

                            )}
                           
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                   <Select disabled={loading} 
                                   onValueChange={field.onChange} 
                                   value={field.value}
                                   defaultValue={field.value}
                                   >
                                    <FormLabel>Billboard</FormLabel>
                                     <FormControl>
                                        <SelectTrigger >
                                            <SelectValue defaultValue={field.value} placeholder="Select a billboard"/>
                                        </SelectTrigger>
                                     </FormControl>
                                     <SelectContent>
                                        {billboards.map((billboard) => (
                                    <SelectItem key={billboard.id} value={billboard.id}>
                                        {billboard.label}
                                    </SelectItem>
                                         ))}
                                     </SelectContent>
                                   </Select>
                                </FormItem>

                            )}
                           
                        />
                    </div>
                    <Button className="ml-auto" type="submit" disabled={loading}>
                        {action}
                    </Button>
                </form>
            </Form>
        </>

    )
}
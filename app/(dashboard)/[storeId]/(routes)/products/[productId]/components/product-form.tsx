"use client"
import ImageUpload from "@/components/ui/image-upload";
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { Button } from "@/components/ui/modals/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/modals/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heading } from "@/components/ui/modals/heading";
import { Input } from "@/components/ui/modals/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-orign";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, size } from "@prisma/client"
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from 'zod';
import { Checkbox } from "@/components/ui/checkbox";



interface ProductFormProps {
    initialData: Product & {
     images: Image[]
    } | null;
    categories: Category[]
    sizes: size[]
    colors: Color[]
    
}
const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchieved: z.boolean().default(false).optional(),

})
type ProductFormValues = z.infer<typeof formSchema>;


export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    sizes,
    colors

}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const title = initialData ? "Edit Product" : "Create Product"
    const description = initialData ? "Edit Product" : "Add a new Product"
    const toastMessage = initialData ? "Edit updated." : "Product created."
    const action = initialData ? "Save chages." : "Create"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
             price: parseFloat(String(initialData?.Price))} : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchieved: false

        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
                console.log()
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }

            router.refresh();
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`)
            toast.success("Product deleted")

        } catch (error) {
            toast.error("Something went wrong.")
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
                    <FormField
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((image) => image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                            </FormItem>

                        )}
                        control={form.control}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product name " {...field} />
                                    </FormControl>
                                </FormItem>

                            )}
                            control={form.control}
                        />
                                   <FormField
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type= "number"disabled={loading} placeholder="9.99" {...field} />
                                    </FormControl>
                                </FormItem>

                            )}
                            control={form.control}
                        />
                             
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                   <Select disabled={loading} 
                                   onValueChange={field.onChange} 
                                   value={field.value}
                                   defaultValue={field.value}
                                   >
                                    <FormLabel>Category</FormLabel>
                                     <FormControl>
                                        <SelectTrigger >
                                            <SelectValue defaultValue={field.value} placeholder="Select a category"/>
                                        </SelectTrigger>
                                     </FormControl>
                                     <SelectContent>
                                        {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                         ))}
                                     </SelectContent>
                                   </Select>
                                </FormItem>

                            )}
                           
                        />
                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                   <Select disabled={loading} 
                                   onValueChange={field.onChange} 
                                   value={field.value}
                                   defaultValue={field.value}
                                   >
                                    <FormLabel>Size</FormLabel>
                                     <FormControl>
                                        <SelectTrigger >
                                            <SelectValue defaultValue={field.value} placeholder="Select a size"/>
                                        </SelectTrigger>
                                     </FormControl>
                                     <SelectContent>
                                        {sizes.map((size) => (
                                    <SelectItem key={size.id} value={size.id}>
                                        {size.name}
                                    </SelectItem>
                                         ))}
                                     </SelectContent>
                                   </Select>
                                </FormItem>

                            )}
                           
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                   <Select disabled={loading} 
                                   onValueChange={field.onChange} 
                                   value={field.value}
                                   defaultValue={field.value}
                                   >
                                    <FormLabel>Color</FormLabel>
                                     <FormControl>
                                        <SelectTrigger >
                                            <SelectValue defaultValue={field.value} placeholder="Select a size"/>
                                        </SelectTrigger>
                                     </FormControl>
                                     <SelectContent>
                                        {colors.map((color) => (
                                    <SelectItem key={color.id} value={color.id}>
                                        {color.name}
                                    </SelectItem>
                                         ))}
                                     </SelectContent>
                                   </Select>
                                </FormItem>

                            )}
                           
                        />
                          <FormField
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ">
                                    <FormControl>
                                        <Checkbox 
                                        checked={field.value}
                                        //@ts-ignore
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        Featured
                                    <FormDescription className="mt-2 text-sm">
                                        This product will appear on the page.
                                    </FormDescription>
                                    </div>        
                                </FormItem>

                            )}
                            control={form.control}
                        />
                          <FormField
                            name="isArchieved"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ">
                                    <FormControl>
                                        <Checkbox 
                                        checked={field.value}
                                        //@ts-ignore
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        Archieved
                                    <FormDescription className="mt-2 text-sm">
                                        This product will not appear any where in the store.
                                    </FormDescription>
                                    </div>        
                                </FormItem>

                            )}
                            control={form.control}
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
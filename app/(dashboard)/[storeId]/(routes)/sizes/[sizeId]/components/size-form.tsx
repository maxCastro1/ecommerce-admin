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
import { Billboard, Category, size } from "@prisma/client"
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from 'zod';



interface SizeFormProps {
    initialData: size | null
}
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})
type SizeFormValues = z.infer<typeof formSchema>;

export const SizeForm: React.FC<SizeFormProps> = ({
    initialData,
   
    

}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const title = initialData ? "Edit Size" : "Create Size"
    const description = initialData ? "Edit Size" : "Add a new Size"
    const toastMessage = initialData ? "Edit updated." : "Size created."
    const action = initialData ? "Save chages." : "Create"
    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    })

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
          
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data)
            }

            router.refresh();
            router.push(`/${params.storeId}/sizes`)
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
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            router.refresh();
            router.push(`/${params.storeId}/sizes`)
            toast.success("Size deleted")

        } catch (error) {
            toast.error("Make sure you removed all products using this sizes.")
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
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Size label" {...field} />
                                    </FormControl>
                                </FormItem>

                            )}
                           
                        />
                        <FormField
                           control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Size value" {...field} />
                                    </FormControl>
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
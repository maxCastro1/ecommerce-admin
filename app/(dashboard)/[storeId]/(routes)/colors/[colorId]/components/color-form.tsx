"use client"
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { Button } from "@/components/ui/modals/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/modals/form";
import { Heading } from "@/components/ui/modals/heading";
import { Input } from "@/components/ui/modals/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-orign";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color} from "@prisma/client"
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from 'zod';



interface ColorFormProps {
    initialData: Color | null
}
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: 'String must be a valid hex code'
    }),
})
type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({
    initialData,
   
    

}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const title = initialData ? "Edit Color" : "Create Color"
    const description = initialData ? "Edit Color" : "Add a new Color"
    const toastMessage = initialData ? "Edit updated." : "Color created."
    const action = initialData ? "Save chages." : "Create"
    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    })

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
          
            } else {
                await axios.post(`/api/${params.storeId}/colors`, data)
            }

            router.refresh();
            router.push(`/${params.storeId}/colors`)
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            router.refresh();
            router.push(`/${params.storeId}/colors`)
            toast.success("Colors deleted")

        } catch (error) {
            toast.error("Make sure you removed all products using this colors.")
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
                                        <Input disabled={loading} placeholder="Color name" {...field} />
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
                                        <div className="flex items-center gap-x-4">
                                        <Input disabled={loading} placeholder="Color value" {...field} />
                                        <div className="p-4 rounded-full" style={{backgroundColor: field.value}} />
                                        </div>
                                      
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
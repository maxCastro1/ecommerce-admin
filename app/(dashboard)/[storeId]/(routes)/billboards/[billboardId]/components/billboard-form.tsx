"use client"
import ImageUpload from "@/components/ui/image-upload";
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { Button } from "@/components/ui/modals/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/modals/form";
import { Heading } from "@/components/ui/modals/heading";
import { Input } from "@/components/ui/modals/input";
import { Separator } from "@/components/ui/separator";
import { useOrigin } from "@/hooks/use-orign";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client"
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from 'zod';



interface BilloardFormProps {
    initialData: Billboard | null;
}
const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
})
type BilloardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BilloardFormProps> = ({
    initialData,

}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const title = initialData ? "Edit billboard" : "Create billboard"
    const description = initialData ? "Edit billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Edit updated." : "Billboard created."
    const action = initialData ? "Save chages." : "Create"
    const form = useForm<BilloardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    })

    const onSubmit = async (data: BilloardFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
                console.log()
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }

            router.refresh();
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`)
            toast.success("Billboard deleted")

        } catch (error) {
            toast.error("Make sure you removed all Categories using this billboard.")
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
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange('')}
                                    />
                                </FormControl>
                            </FormItem>

                        )}
                        control={form.control}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Billboard label" {...field} />
                                    </FormControl>
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
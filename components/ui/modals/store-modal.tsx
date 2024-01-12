"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../modals/modal";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../modals/form";
import {zodResolver} from '@hookform/resolvers/zod'
import { Input } from "../modals/input";
import { Button } from "./button";
import { useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";

const formSchema = z.object({
    name:z.string().min(1),

})
export const StoreModal = () => {
    const [loading, setLoading] = useState(false)
    const storeModal = useStoreModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name:"",
        },
    })

 const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        setLoading(true)
       const response = await axios.post('/api/stores', values); 
    //    toast.success("Store created.")
     window.location.assign(`/${response.data.id}`);
        
      } catch (error) {
      
        toast.error("Something went wrong.")

        
      }
      finally{
        setLoading(false)
      }
 }

   return(
    <Modal 
    title="Crete store"
    description ="Add a new store to manage products and categories"
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}>
        <div>
        <div className="space-y-4 py-2 pb-4">
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                control={form.control}
                name='name'
                render={({field}) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="E-commerce" 
                        {...field} 
                        disabled={loading}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
                )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button variant='outline' onClick={storeModal.onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" disabled={loading}>Continue</Button>
                </div>
            </form>
         </Form>
         </div>
        </div>
       
    </Modal>
   )
}
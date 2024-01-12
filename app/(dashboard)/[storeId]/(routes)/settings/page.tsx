import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
};
const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {
    const {userId} = auth();

    if(!userId) {
        redirect("/sign-in");
    }

    const Store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if(!Store){
        redirect('/')
    }

    return(
        <div className="flex-col">
           <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm  initialData={Store}/>
           </div>
        </div>
    )
}
export default SettingsPage;
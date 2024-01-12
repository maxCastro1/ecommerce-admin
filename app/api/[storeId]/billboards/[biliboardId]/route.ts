import prismadb from "@/lib/prismadb";
import { auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET (
    req: Request,
    { params} : { params: {storeId: string, biliboardId: string }}
    ) {
        try {
           
            if(!params.biliboardId){
                return new NextResponse("Name is required", {status: 400});
            }
       
            const billboard = await prismadb.billboard.findUnique({
                where: {
                    id: params.biliboardId,
                }
            })

            return NextResponse.json(billboard)
        
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error" , { status: 500});
    }}
export async function PATCH (
   
    req: Request,
    { params} : { params: {storeId: string,  biliboardId: string }}
    ) {
        try {
            console.log(params)
            const { userId } = auth();
            const body = await req.json();

            const { label, imageUrl} = body;
            if(!userId) return new NextResponse ('Unauthenticated', { status: 401});
            if(!label) return new NextResponse("Label is required", {status: 400});
            if(!imageUrl) return new NextResponse("Image url is required", {status: 400});
            if(!params. biliboardId) return new NextResponse("Billboard id is required", {status: 400});
            


            const StoreByUserId = await prismadb.store.findFirst({
                where: {
                    id: params.storeId,
                    userId
                }
            })


            if(!StoreByUserId) return new NextResponse("Unauthorized", {status: 403})

            const  billboard = await prismadb.billboard.updateMany({
                where: {
                    id: params. biliboardId,
                },
                data: {
                    label, 
                    imageUrl
                }
            })

            return NextResponse.json(billboard)
        
    } catch (error) {
        console.log('[BILLBOARDS_PATCH]', error);
        return new NextResponse("Internal error" , { status: 500});
    }}
export async function DELETE (
    req: Request,
    { params} : { params: {storeId: string, biliboardId: string }}
    ) {
        try {
        
            const { userId } = auth();
            if(!userId){
                return new NextResponse ('Unauthenticated', { status: 401});
            }
      
            if(!params.biliboardId){
                return new NextResponse("Name is required", {status: 400});
            }
            const StoreByUserId = await prismadb.store.findFirst({
                where: {
                    id: params.storeId,
                    userId
                }
            })


            if(!StoreByUserId) return new NextResponse("Unauthorized", {status: 403})

            const billboard = await prismadb.billboard.deleteMany({
                where: {
                    id: params.biliboardId,
                    // storeId: params.storeId,
                }
            })

            return NextResponse.json(billboard)
        
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error" , { status: 500});
    }}
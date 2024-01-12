import prismadb from "@/lib/prismadb";
import { auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST (
   
    req: Request,
    { params} : { params: {storeId: string }}
    ) {
        try {
            const { userId } = auth();
            const body = await req.json();

            const { name,
                 price,
                 categoryId,
                 colorId,
                 sizeId,
                 images,
                 isFeatured,
                 isArchieved
                } = body;
          
            if(!userId) return new NextResponse ('Unauthenticated', { status: 401});
            if(!name) return new NextResponse ("Names is required", {status: 400});
            if(!categoryId) return new NextResponse ("price is required", {status: 400});
            if(!colorId) return new NextResponse ("color is required", {status: 400});
            if(!sizeId) return new NextResponse ("size is required", {status: 400});
            if(!images || !images.length)return new NextResponse ("images is required", {status: 400});
            if(!price) return new NextResponse ("price is required", {status: 400});
            if(!params.storeId) return new NextResponse ("Store id is required", {status: 400});
            
            const StoreByUserId = await prismadb.store.findFirst({
                where: {
                    id: params.storeId,
                    userId
                }
            })

            if(!StoreByUserId) return new NextResponse("Unauthorized", {status: 403})

            const product = await prismadb.product.create({
                data:{
                    name,
                    Price:price,
                    categoryId,
                    colorId,
                    sizeId,
                    images : {
                        createMany : {
                            data : [
                                ...images.map((image: { url: string}) => image)
                            ]
                        }
                    },
                    isFeatured,
                    isArchieved,
                     storeId: params.storeId
                }
            })

            return NextResponse.json(product)
        
    } catch (error) {
        console.log('[PRODUCT_POST]', error);
        return new NextResponse("Internal error" , { status: 500});
    }}
export async function GET (

    req: Request,
    { params} : { params: {storeId: string }}
    ) {
        try {
             const { searchParams} = new URL(req.url);
             const categoryId = searchParams.get("categoryId") || undefined
             const colorId = searchParams.get("colorId") || undefined
             const sizeId = searchParams.get("sizeId") || undefined
             const isFeatured = searchParams.get("isFeatured")

            if(!params.storeId) return new NextResponse("Store id is required", {status: 400});

            const  products = await prismadb.product.findMany({
            where:{
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchieved: false 
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy : {
                createdSt: 'desc'
            }
        })

            return NextResponse.json(products)
        
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error" , { status: 500});
    }}

export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string }}
    ) {
        try {
            const { userId } = auth();
            if(!userId){
                return new NextResponse ('Unauthenticated', { status: 401});
            }
      
            if(!params.storeId){
                return new NextResponse("Name is required", {status: 400});
            }

            const store = await prismadb.store.deleteMany({
                where: {
                    id: params.storeId,
                    userId
                }
            })

            return NextResponse.json(store)
        
    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal error" , { status: 500});
    }}
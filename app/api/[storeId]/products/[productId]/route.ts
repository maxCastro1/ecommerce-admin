import prismadb from "@/lib/prismadb";
import { auth} from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET (
    req: Request,
    { params} : { params: {storeId: string, productId: string }}
    ) {
        try {
           
            if(!params.productId){
                return new NextResponse("category id is required", {status: 400});
            }
       
            const product = await prismadb.product.findUnique({
                where: {
                    id: params.productId,
                },
                include: {
                    images:true,
                    category:true,
                    size:true,
                    color:true
                }
            })

            return NextResponse.json(product)
        
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error" , { status: 500});
    }}
export async function PATCH (
   
    req: Request,
    { params} : { params: {storeId: string,  productId: string }}
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
              if(!params.productId) return new NextResponse("productId is required", {status: 400});

            


            const StoreByUserId = await prismadb.store.findFirst({
                where: {
                    id: params.storeId,
                    userId
                }
            })


            if(!StoreByUserId) return new NextResponse("Unauthorized", {status: 403})

            await prismadb.product.update({
                where: {
                    id: params.productId,
                },
                data:{
                    name,
                    Price:price,
                    categoryId,
                    colorId,
                    sizeId,
                    images : {
                        deleteMany: {}
                    },
                    isFeatured,
                    isArchieved,
                     storeId: params.storeId
                }
            })

            const product = await prismadb.product.update({
                where: {
                    id: params.productId
                },
                data: {
                    images : {
                        createMany : {
                            data : [
                                ...images.map((image: { url: string}) => image)
                            ]
                        }
                    },
                }
            })
            return NextResponse.json(product)
        
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error" , { status: 500});
    }}
export async function DELETE (
    req: Request,
    { params} : { params: {storeId: string, productId: string }}
    ) {
        try {
        
            const { userId } = auth();
            if(!userId){
                return new NextResponse ('Unauthenticated', { status: 401});
            }
      
            if(!params.productId){
                return new NextResponse("product id  is required", {status: 400});
            }
            const StoreByUserId = await prismadb.store.findFirst({
                where: {
                    id: params.storeId,
                    userId
                }
            })


            if(!StoreByUserId) return new NextResponse("Unauthorized", {status: 403})

            const product = await prismadb.product.deleteMany({
                where: {
                    id: params.productId,
                   
                }
            })

            return NextResponse.json(product)
        
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error" , { status: 500});
    }}
import { summaryApi } from "@/common/summaryApi";
import { ShoppingBag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const ProductPage = () => {
  const user = useSelector(state=>state.user);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const params = useParams();

  const fetchProducts = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(summaryApi.getProviderProduct.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          providerId: params.id,
        }),
      });
      const responseData = await response.json();
      setProducts(responseData.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching, even if there's an error
    }
  };

  const addToCart = async(e,productId)=>{
    e.stopPropagation();
    try {
        const response = await fetch(summaryApi.addToCart.url,{
          method : summaryApi.addToCart.method,
          headers : {
            "content-type" : "application/json"
          },
          body :JSON.stringify({
            productId : productId,
            productOwner : params.id
          }),
          credentials : "include"
        });
        const responseData = await response.json();
        if(responseData?.success){
          toast.success(responseData?.message);
        }else{
          toast.error(responseData?.message);
        }
        console.log(responseData);
    } catch (error) {
      toast.error("Something went wrong !");
        console.log(error);
    }
  }

  useEffect(() => {
    fetchProducts();
    console.log(products)
  }, [params.id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Products You Might Like</h1>
      <p className="text-gray-600 mb-8">Assured Delivery Within 10 Minutes</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? // Skeleton Loading
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mt-3"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2 mt-2"></div>
                <div className="h-6 bg-gray-200 rounded-md mt-3 w-2/3"></div>
              </div>
            ))
          : // Actual Product Display
            products.map((product) => (
              <Dialog>
                <DialogTrigger>
                  {" "}
                  <div
                    key={product.productName}
                    className="bg-white cursor-pointer rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105"
                  >
                    <div className="relative h-48">
                      {product.productImages.length > 0 ? (
                        <img
                          src={product.productImages[0]}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 animate-pulse" />
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-medium mb-2">
                        {product.productName}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {product.productDescription}
                      </p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xl font-bold">
                          ${product.productSellingPrice}
                        </span>
                        <button onClick={(e)=>addToCart(e,product._id)} className="bg-purple-600 flex gap-2 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300">
                          Add to Cart <ShoppingBag />
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="my-10 pb-10 w-full">
                  <div className="h-[100vh] overflow-y-scroll w-full py-10">
                  <DialogHeader className={'w-full'}>
                    <DialogTitle>Item Details : </DialogTitle>
                    <DialogDescription>
                      <div className="flex items-center flex-col">
                        <Carousel className="w-full max-w-xs">
                          <CarouselContent>
                            {product.productImages.length > 0 &&
                              product.productImages.map((item, index) => (
                                <CarouselItem key={index}>
                                  <div className="p-1">
                                    <Card>
                                      <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <div>
                                          <img
                                            src={item}
                                            alt=""
                                            className="aspect-square"
                                          />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </CarouselItem>
                              ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                        <div>
                  </div>
                      </div>
                      <div className="flex items-baseline flex-col gap-2">
                      <span className="py-2 px-1 rounded-full bg-purple-400 text-primary" >{product.productCategory}</span>
                      <span className="text-4xl font-bold" >{product.productName}</span>
                      <div className="mx-2 items-baseline flex">
                        <p>{product.productDescription}</p>
                      </div>
                      <div className="flex gap-2 items-center ">
                      <del className="text-gray-500 text-4xl">₹{product.productCostPrice} </del>
                      <div className="text-primary font-bold text-2xl">₹{product.productSellingPrice}</div>
                      </div>
                      <div className="w-full">
                        <Button className="w-full" onClick={(e)=>addToCart(e,product._id)}>Buy Now</Button>
                      </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
      </div>
    </div>
  );
};

export default ProductPage;

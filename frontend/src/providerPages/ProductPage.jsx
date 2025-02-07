import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2Icon, UploadCloud } from "lucide-react";
import { uploadFile } from "@/helpers/uploadPhoto";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { summaryApi } from "@/common/summaryApi";

const ProductPage = () => {

    const [productData,setProductData] = useState({
        productName: "",
        productDescription : "",
        productCostPrice : "",
        productSellingPrice : "",
        productCategory : "",
        productImages : []
    })

    const handleOnChange = (e)=>{
        const {name,value} = e.target;

        setProductData({
            ...productData,
            [name] : value
        })
    }

    const [imgLoading,setImgLoading] = useState(false);

    const handleImageUpload = async(e)=>{
        const file = e.target.files[0];
        console.log("file",file);
        try {
            setImgLoading(true)
            const response = await uploadFile(file);
            console.log(response)
            const {url } = response;
            setProductData({
                ...productData,
                productImages:[...productData.productImages,url]
            })
        } catch (error) {
            console.log(error)
        }finally{
            setImgLoading(false);
        }
    }

    const handleRemoveImage = (index)=>{
        // gallery.
        const newGallery = [...productData.productImages];
        newGallery.splice(index,1);
        setProductData((prev)=>{
          return{
            ...prev,
            productImages:[...newGallery]
          }
        })
      }

      const[loading,setLoading] = useState(false);
    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!productData.productName || !productData.productCategory || !productData.productCostPrice || !productData.productSellingPrice || !productData.productDescription){
            toast.error("All fields are required !")
            return;
        }
        // console.log(productData);
        try {
            const response = await fetch(summaryApi.uploadProduct.url,{
                method : summaryApi.uploadProduct.method,
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify(productData),
                credentials : "include"
            })

            const responseData = await response.json();
            console.log(responseData);
            if(responseData?.success){
                toast.success(responseData?.message);
            }else{
                toast.error(responseData?.message);

            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong !");

        }
    }

    const[fetchingProduct,setFetchingProduct] = useState(true)
    const fetchProducts = async()=>{
        try {
            const response = await fetch(summaryApi.getProduct.url,{credentials : "include"});
            const responseData = await response.json();
            console.log(responseData)
            setProducts(responseData?.data);
        } catch (error) {
            console.log(error);
        }   
    }

  const [products, setProducts] = useState([]);
  useEffect(()=>{
    fetchProducts();
  },[])
  return (
    <>
      <div className="flex justify-end my-10">
        {products.length >= 1 && <Button>Upload Product</Button>}
      </div>
      <div className="flex items-center justify-center my-10">
        <div>
          {products.length < 1 ? (
            <div  >
              <p>Are you selling something ?</p>
              <Dialog className="mx-5">
                <DialogTrigger>
                  <Button className="my-5">Upload Products</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter Product Details</DialogTitle>
                  </DialogHeader>
                  <Input placeholder="Product Name" name="productName" value={productData.productName} onChange={(e)=>handleOnChange(e)} className="my-1" />
                  <Input placeholder="Product Description" name="productDescription" value={productData.productDescription} onChange={(e)=>handleOnChange(e)} className="my-1" />
                  <Input
                    placeholder="Product Cost Price"
                    className="my-1 appearance-none  [&::-webkit-inner-spin-button]:hidden 
                 [&::-webkit-outer-spin-button]:hidden 
                 [-moz-appearance:textfield]"
                    type="number"
                    name="productCostPrice" value={productData.productCostPrice} onChange={(e)=>handleOnChange(e)}
                  />
                  <Input
                    placeholder="Product Selling Price"
                    className="my-1 appearance-none  [&::-webkit-inner-spin-button]:hidden 
                 [&::-webkit-outer-spin-button]:hidden 
                 [-moz-appearance:textfield]"
                    type="number"
                    name="productSellingPrice" value={productData.productSellingPrice} onChange={(e)=>handleOnChange(e)}
                  />

                  <Input placeholder="Category ex :- shoe" type="text" id="productCategory" name="productCategory" value={productData.productCategory} onChange={(e)=>handleOnChange(e)} />

                  <div>
                    <div  htmlFor="image" className="py-5 w-full border rounded flex items-center justify-center"> {imgLoading ? <Loader2Icon className="animate-spin dark:text-white" /> : <label htmlFor="image"  className="border flex gap-1 px-2 py-2 rounded border-primary cursor-pointer hover:bg-primary hover:text-white transition-all" >Upload Images <UploadCloud/> </label>} </div>
                    <input type="file"  name="image" id="image" className="hidden" onChange={(e)=>handleImageUpload(e)} />
                  </div>
                  <div className="flex gap-5 flex-wrap">
                    {
                        productData.productImages.length >0 && productData.productImages.map((item,index)=>(
                            <div className="relative" key={index}>
                                <div>
                                <img src={item} alt="images" className="aspect-square h-20 w-20" />
                                <span className="absolute right-0 bottom-1 cursor-pointer" ><MdDelete className="text-red-500 h-7 w-7" onClick={()=>handleRemoveImage(index)} /></span>
                                </div>
                            </div>
                        ))
                    }
                  </div>
                  <Button onClick={(e)=>handleSubmit(e)}>Add Product</Button>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-4">
              {products.map((item, index) => (
                <div key={index} className="p-2 rounded shadow-lg cursor-pointer" >
                    <div className="flex flex-col gap-3" >
                    <img src={item.productImages[0]} alt="img" className="hover:scale-105 transition-all rounded " />
                    <div className="flex gap-5">
                    <del className="text-red-500 font-semibold">Rs. {item.productCostPrice}</del>
                    <span className="text-primary">Rs. {item.productSellingPrice}</span>
                    </div>
                    <p className="line-clamp-4">{item.productDescription}</p>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;

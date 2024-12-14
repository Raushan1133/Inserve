const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_KEY}/auto/upload`
const delete_url = "https://api.cloudinary.com/v1_1/<cloud_name>/resources/image/destroy"

const uploadFile = async(file)=>{
    const formData = new FormData()
    formData.append('file',file)
    formData.append("upload_preset","inserve")

    const response = await fetch(url,{  
        method : 'post',
        body : formData
    })
    const responseData = await response.json()


    return responseData
}

const deleteFile = async(public_id)=>{
    const response =await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_KEY}/${public_id}/image/destroy`,{method:"POST"});
    const data = await response.json();
    return data;
}

export  {uploadFile,deleteFile}
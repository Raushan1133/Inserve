export const summaryApi ={
    // User Register / Login
    register:{
        url:import.meta.env.VITE_SERVER+"/api/user/register",
        method:"POST"
    },

    // Provider Register/Login
    registerProvider:{
        url:import.meta.env.VITE_SERVER+"/api/business/add-business",
        method:"POST"
    },

    // Login both provider/seeker
     login : {
        url:import.meta.env.VITE_SERVER+"/api/common/login",
        method:"POST"
    },

    // Logout both provider/seeker
    logout:{
        url:import.meta.env.VITE_SERVER+"/api/common/logout",
        method:"GET"
    },

    // Get user details
    getUserDetails:{
        url:import.meta.env.VITE_SERVER+"/api/common/get-user-details",
        method:"GET" 
    },

    // Update details
    updateUserDetails:{
        url:import.meta.env.VITE_SERVER+"/api/common/update-details",
        method:"PATCH" 
    },
    changePassword:{
        url:import.meta.env.VITE_SERVER+"/api/common/change-password",
        method:"PATCH" 
    },

    // Manage categories list 
    fetchCategories:{
        url:import.meta.env.VITE_SERVER+"/api/categories/all-category",
        method:"GET"
    },
    addCategory:{
        url:import.meta.env.VITE_SERVER+"/api/categories/add-category",
        method:"POST"
    },

    // Businesses
    getAllBusiness :{
        url:import.meta.env.VITE_SERVER+"/api/business/all-business",
        method:"GET"
    },
    // Get Business By Id
    getBusinessById :{
        url:import.meta.env.VITE_SERVER+"/api/business/get-business",
        method:"POST"
    },
    // Get Business By Category
    getBusinessByCategory : {
        url:import.meta.env.VITE_SERVER+"/api/business/get-business-by-category",
        method:"POST"
    }
}
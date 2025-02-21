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

    // Get user by id
    getUserById : {
        url:import.meta.env.VITE_SERVER+"/api/user/get-user-by-id",
        method:"POST" 
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

    // Change business Details

    fetchProviderDetails:{
        url:import.meta.env.VITE_SERVER+"/api/business/get-provider-details",
        method:"GET" 
    },

    updateBusinessDetails : {
        url:import.meta.env.VITE_SERVER+"/api/business/update-business-details",
        method:"PUT" 
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
    },

    // Bookings
    addBooking : {
        url:import.meta.env.VITE_SERVER+"/api/booking/add-booking",
        method:"POST"
    },

    getBookedSlot: {
        url:import.meta.env.VITE_SERVER+"/api/booking/get-booked-slot",
        method:"POST"
    },
    getBookings : {
        url : import.meta.env.VITE_SERVER+"/api/booking/get-bookings",
        method : "GET"
    },
    cancellBookingByUser : {
        url : import.meta.env.VITE_SERVER+"/api/booking/cancel-booking-by-user",
        method : "PATCH"
    },
    sendCancellationOtpByUser : {
        url : import.meta.env.VITE_SERVER+"/api/booking/send-cancel-otp",
        method : "POST"
    },

    cancelBookingByProvider : {
        url : import.meta.env.VITE_SERVER+"/api/booking/cancel-booking-by-provider",
        method : "PATCH"
    },

    updateStatus : {
        url : import.meta.env.VITE_SERVER+"/api/booking/update-status",
        method : "PATCH"
    },

    // Product api's

    uploadProduct : {
        url : import.meta.env.VITE_SERVER+"/api/product/add-product",
        method : "POST"
    },
    getProduct : {
        url : import.meta.env.VITE_SERVER+"/api/product/get-product",
        method : "GET"
    },
    getProviderProduct : {
        url : import.meta.env.VITE_SERVER+"/api/product/get-provider-products",
        method : "POST"
    },

    // Cart functionality
    addToCart : {
        url : import.meta.env.VITE_SERVER+"/api/cart/add-to-cart",
        method : "POST"
    },

    getCartItems : {
        url : import.meta.env.VITE_SERVER+"/api/cart/get-cart",
        method : "GET"
    },
    deleteCartItems : {
        url : import.meta.env.VITE_SERVER+"/api/cart/delete-cart",
        method : "POST"
    },

    increaseQty : {
        url : import.meta.env.VITE_SERVER+"/api/cart/increase-qty",
        method : "PATCH"
    },
    decreaseQty : {
        url : import.meta.env.VITE_SERVER+"/api/cart/decrease-qty",
        method : "PATCH"
    },

    // Find Businesses by range
    searchBusiness : {
        url : import.meta.env.VITE_SERVER+"/api/user/find-businesses",
        method : "POST"
    }
}
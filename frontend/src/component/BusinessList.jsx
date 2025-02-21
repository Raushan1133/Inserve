import { Button } from '@/components/ui/button';
import { getAddressFromCoordinates } from '@/helper/getAddressFromCoordinates';
import { MapPin, Store, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BusinessList = ({ isLoading, title, businessList }) => {
  const [addresses, setAddresses] = useState({});

  // Function to fetch addresses
  const getAddressFromCoordinate = async (latitude, longitude, id) => {
    try {
      const data = await getAddressFromCoordinates(latitude, longitude);
      setAddresses((prev) => ({ ...prev, [id]: data })); // Store each address using business ID
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    if (businessList?.length > 0) {
      businessList.forEach((item) => {
        if (item?.location?.coordinates) {
          getAddressFromCoordinate(
            item.location.coordinates[0],
            item.location.coordinates[1],
            item._id
          );
        }
      });
    }
  }, [businessList]);

  return (
    <div>
      <h1 className="my-5 font-bold text-4xl text-primary">{title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-2  mt-2">
        {isLoading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((item, idx) => (
              <div
                key={idx}
                className="h-[300px] rounded-lg w-full bg-slate-300 animate-pulse"
              ></div>
            ))
          : businessList?.length > 0
          ? businessList.map((item, index) => (
              <Link
                to={item?._id ? `/details/${item._id}` : "#"}
                key={index}
                className="flex flex-col shadow-md items-baseline dark:bg-gray-900 rounded-lg hover:shadow-lg hover:shadow-primary transition-all ease-in-out cursor-pointer hover:scale-10"
              >
                <img
                  src={item?.profile_pic}
                  alt="profile_pic"
                  className="h-[150px] md:h-[200px] object-cover rounded"
                  height={200}
                  width={500}
                />
                <div className="p-3 flex flex-col items-baseline gap-1">
                  <h1 className="bg-cyan-400 line-clamp-1  text-sm p-1 px-2 mt-1 rounded-full">
                    {item?.category?.name}
                  </h1>
                  <h2 className="font-semibold  text-sm md:text-lg flex items-center gap-1">
                    <Store /> <span className='line-clamp-1'>{item?.businessName}</span>
                  </h2>
                  <h2 className="text-primary text-ellipsis text-sm md:text-lg flex items-center gap-1">
                    <User />
                    <span>{item?.personName}</span>
                  </h2>
                  <h2 className="text-gray-500 text-ellipsis text-sm md:text-lg flex items-center gap-1">
                    <MapPin />
                    <span className='line-clamp-3'> 
                      {addresses[item._id] || "Fetching address..."}
                    </span>
                  </h2>
                  <Button className="bg-primary">Book Now</Button>
                </div>
              </Link>
            ))
          : (
            <div className="h-[60vh] w-full flex items-center ml-24 sm:ml-44 md:ml-48 lg:ml-80">
              <h1 className="text-center font-semibold text-red-500 text-2xl">
                Oops!, Currently we are not providing selected services.
              </h1>
            </div>
          )}
      </div>
    </div>
  );
};

export default BusinessList;

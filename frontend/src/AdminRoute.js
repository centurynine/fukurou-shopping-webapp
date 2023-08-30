import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import getUserData from './getUserData';

const AdminRoute = ({ element }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม state สำหรับตรวจสอบว่าข้อมูลถูกโหลดเสร็จแล้วหรือไม่

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      getUserData(token)
        .then(userData => {
 
          setIsAdmin(userData.isAdmin);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false); 
        });
    } else {
      setIsLoading(false); 
    }
  }, []);

  if (isLoading) {
    toast.loading('กำลังโหลด...');
    return null;
  }
  toast.remove();
  if (isAdmin) {
    return element; 
  } else {
    return <Navigate to="/" replace />;
  }

};

export default AdminRoute;

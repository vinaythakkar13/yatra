'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const AdminDashboard = () => {

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminAccessToken');
        console.log(token);
        if (!token) {
            router.push('/admin/login');
        }else{
            router.push('/admin');
        }
    }, []);

  return (
    <div></div>
  )
}

export default AdminDashboard
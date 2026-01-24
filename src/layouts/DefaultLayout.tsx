// ** React
import React from 'react';

// ** Layout components
import Header from "@/layouts/components/Header";
import Footer from "@/layouts/components/Footer";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header/>
            <main className='flex flex-col min-h-[70vh] mt-header'>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default DefaultLayout;
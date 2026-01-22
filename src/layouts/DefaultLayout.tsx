// ** React
import React from 'react';

// ** Layout components
import Footer from "@/layouts/components/Footer";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <main className='flex flex-col min-h-[70vh]'>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default DefaultLayout;
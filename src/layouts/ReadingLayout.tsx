// ** React
import React from 'react';

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <main className='flex flex-col min-h-[70vh] mt-header'>
                {children}
            </main>
        </>
    );
};

export default DefaultLayout;
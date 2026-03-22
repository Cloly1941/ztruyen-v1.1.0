// ** React
import React from 'react';

const ReadingLayout = async ({children}: { children: React.ReactNode }) => {

    return (
        <>
            <main className='flex flex-col min-h-[70vh] mt-header'>
                {children}
            </main>
        </>
    );
};

export default ReadingLayout;
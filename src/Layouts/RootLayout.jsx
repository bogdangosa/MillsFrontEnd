import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Components/Navigation/Header';

const RootLayout = ({ children }) => {
    return (
        <>
            <Header />
            <Outlet/>
        </>
    );
};

export default RootLayout;

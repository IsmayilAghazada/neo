import * as React from 'react';
import { Header } from './Header';
// import { PopularJobs } from './PopularJobs';
import { FeatureJobs } from './FeaturedJobs';
import { Freelancers } from './Freelancer';

const MainPage: React.FC = () => {
    return (
        <>
            <Header />
            <Freelancers />
            {/* 
                    TODO: temporarily commented
                     */}
            {/* <PopularJobs /> */}
            <FeatureJobs />
        </>
    );
};
export default MainPage;

import { useAsyncData } from 'app/hooks';
import { IPost } from 'app/models/Post';
import { PostService } from 'app/services/Post';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import './index.scss';
import { isError, isLoading, isSuccess } from 'utils';
import { Helmet } from 'react-helmet';
import { JobViewSkeleton } from './JobViewSkeleton';
import { JobViewSuccess } from './JobViewSuccess';
import { JobViewError } from './JobViewError';

const JobDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setData] = useAsyncData<IPost>();

    React.useEffect(() => {
        setData(() => PostService.getById(id));
    }, []);

    const renderContent = () => {
        let content;
        if (isError(post)) {
            content = <JobViewError error={post.error} />;
        } else if (isLoading(post)) {
            content = <JobViewSkeleton />;
        } else if (isSuccess(post)) {
            content = <JobViewSuccess data={post.data} />;
        }
        return content;
    };

    return (
        <>
            <Helmet>
                <meta property="og:url" content={`https://doqquz.az/view-job/${id}`} />
            </Helmet>
            {renderContent()}
        </>
    );
};
export default JobDetails;

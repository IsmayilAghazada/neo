import * as React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import './index.scss';
import { BookmarkService } from 'app/services/Bookmark';
import { Controller, useForm } from 'react-hook-form';
import { IBookmark } from 'app/models/Bookmark';
import { groupBy } from 'lodash';
import { useAsyncData } from 'app/hooks';
import { isError, isLoading, isSuccess } from 'utils';
import { Loading } from 'ui-kit/Loading';
import { ServerErrorPanel } from 'ui-kit/ServerErrorPanel';
import { PostBookmarkItem } from './PostBookmarkItem';
import { JobseekerBookmarkItem } from './JobseekerBookmarkItem';

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    },
    root: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        margin: 0,
        paddingBottom: 64,
    },
    noRecords: {
        width: '100%',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
    },
}));
export const Bookmarks: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Common']);
    const [bookmarks, setBookmarks] = useAsyncData<IBookmark[]>();
    const { control, setValue, watch, reset } = useForm<{
        postBookmarks: IBookmark[];
        jobseekerBookmarks: IBookmark[];
    }>({
        mode: 'onBlur',
        defaultValues: {
            postBookmarks: [],
            jobseekerBookmarks: [],
        },
    });
    const postBookmarks = watch('postBookmarks');
    const jobseekerBookmarks = watch('jobseekerBookmarks');

    const onRemovePostBookmarks = (index: number) => {
        const transformedData = postBookmarks?.filter((_, i) => i !== index);
        setValue('postBookmarks', transformedData);
    };
    const onRemoveJobseekerBookmarks = (index: number) => {
        const transformedData = jobseekerBookmarks?.filter((_, i) => i !== index);
        setValue('jobseekerBookmarks', transformedData);
    };

    React.useEffect(() => {
        setBookmarks(() => BookmarkService.getGroupedList());
    }, []);

    React.useEffect(() => {
        if (isSuccess(bookmarks)) {
            const groupedList = groupBy(bookmarks.data, (x) => x.type);
            reset({ postBookmarks: groupedList.POST, jobseekerBookmarks: groupedList.JOBSEEKER });
        }
    }, [bookmarks]);

    return (
        <Grid container className={classes.root}>
            <Loading fullPage visible={isLoading(bookmarks)} />
            <Controller control={control} name="postBookmarks" render={() => null} />
            <Controller control={control} name="jobseekerBookmarks" render={() => null} />
            <Container>
                {isError(bookmarks) && (
                    <div className="row margin-top-24 margin-left-0 margin-right-0">
                        <div className={classes.noRecords}>
                            <ServerErrorPanel />
                        </div>
                    </div>
                )}
                {isSuccess(bookmarks) && (
                    <>
                        <div className="row">
                            <div className="dashboard-headline bookmark-headline">
                                <h3>{t('Common:Menu.profile.items.bookmarks')}</h3>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-12">
                                <div className="dashboard-box">
                                    <div className="headline">
                                        <h3>
                                            <i className="icon-material-outline-business-center" />
                                            {t('Common:bookmark.post')}
                                        </h3>
                                    </div>
                                    <div className="content ">
                                        {postBookmarks?.map((pb, i) => (
                                            <PostBookmarkItem
                                                index={i}
                                                onRemove={onRemovePostBookmarks}
                                                bookmark={pb}
                                                key={i}
                                            />
                                        ))}

                                        {!postBookmarks?.length && (
                                            <div className="row justify-content-center margin-top-36 padding-bottom-36">
                                                {t('Common:noData')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xl-12">
                                <div className="dashboard-box">
                                    <div className="headline">
                                        <h3>
                                            <i className="icon-material-outline-face" />
                                            {t('Common:bookmark.jobseeker')}
                                        </h3>
                                    </div>
                                    <div className="content">
                                        {jobseekerBookmarks?.map((jb, i) => (
                                            <JobseekerBookmarkItem
                                                index={i}
                                                onRemove={onRemoveJobseekerBookmarks}
                                                bookmark={jb}
                                                key={i}
                                            />
                                        ))}

                                        {!jobseekerBookmarks?.length && (
                                            <div className="row justify-content-center margin-top-36 padding-bottom-36">
                                                {t('Common:noData')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Container>
        </Grid>
    );
};
Bookmarks.displayName = 'Bookmarks';
export default Bookmarks;

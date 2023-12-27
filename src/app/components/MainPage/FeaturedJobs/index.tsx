/* eslint-disable no-extra-boolean-cast */
import * as React from 'react';
import { Grid, makeStyles, Container, Box } from '@material-ui/core';
import { ArrowRightAlt } from '@material-ui/icons';
import { isLoading, isSuccess } from 'utils';
import { useAsyncData } from 'app/hooks';
import { ICompany } from 'app/models/Company';
import { IPaginatedData } from 'model';
import { IPost } from 'app/models/Post';
import { PostService } from 'app/services/Post';
import { useTranslation } from 'react-i18next';
import { range } from 'lodash';
import { MenuItem } from '../../Layout/Menu/MenuItem';
import { FeatureJobItem } from './FeaturedJobItem';
import { FeaturedJobItemSkeleton } from './FeaturedJobItemSkeleton';
import { EmptyFeatureJobs } from './EmptyFeatureJobs';

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
    title: { margin: '65px 0 32px 0', display: 'flex', flexWrap: 'wrap' },
}));

export const FeatureJobs: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Home', 'Common']);
    const [postList, setPostList] = useAsyncData<IPaginatedData<Partial<IPost> & { company: Partial<ICompany>[] }>>();

    React.useEffect(() => {
        setPostList(() => PostService.getListAll({ take: 5 }));
    }, []);

    return (
        <Grid container className={classes.root} spacing={2}>
            <Container>
                <div className={classes.title}>
                    <Box display="inline-block" color="#333" fontSize="1.6rem">
                        {t('JobAnnouncement.title')}
                    </Box>
                    <div className={classes.grow} />
                    <MenuItem to="/jobs" name={t('JobAnnouncement.actions.shortLink')}>
                        <ArrowRightAlt />
                    </MenuItem>
                </div>
                <Grid style={{ boxShadow: 'box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12)' }} item xs={12}>
                    <Grid container justify="flex-start" spacing={2}>
                        {isLoading(postList) && range(0, 10).map((x, i) => <FeaturedJobItemSkeleton key={i} />)}
                        {isSuccess(postList) && postList.data.list.map((x, i) => <FeatureJobItem key={i} data={x} />)}
                        {isSuccess(postList) && !Boolean(postList.data.list.length) && <EmptyFeatureJobs />}
                    </Grid>
                </Grid>
            </Container>
        </Grid>
    );
};

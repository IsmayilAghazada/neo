/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Avatar, CircularProgress, makeStyles } from '@material-ui/core';
import { ImageOutlined } from '@material-ui/icons';
import { useAsyncData } from 'app/hooks';
import { IBookmark } from 'app/models/Bookmark';
import { ICompany } from 'app/models/Company';
import { IPost } from 'app/models/Post';
import { ROUTES } from 'app/routes/consts';
import { BookmarkService } from 'app/services/Bookmark';
import { BACKEND_BASE_URL } from 'consts';
import moment from 'moment';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { isInitial, isPending, isSuccess } from 'utils';
import { makePath } from 'utils/router';

const useStyles = makeStyles((theme) => ({
    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

export const JobItem: React.FC<{ data: Partial<IPost> & { company: Partial<ICompany>[] } }> = ({ data }) => {
    const classes = useStyles();
    const { t } = useTranslation('Common');
    const [bookmarked, setBookmarked] = React.useState(Boolean(data.bookmark));
    const [saveBookmark, setSave] = useAsyncData<IBookmark>();

    React.useEffect(() => {
        if (isSuccess(saveBookmark)) {
            setBookmarked((x) => !x);
        }
    }, [saveBookmark]);

    return (
        <Link to={makePath(ROUTES.VIEW_JOB.PATH, { id: data.id })} className="job-listing">
            <div className="job-listing-details">
                <div className="job-listing-company-logo">
                    {data.user?.imageUrl ? (
                        <Avatar className={classes.largeAvatar} src={`${BACKEND_BASE_URL}/${data.user.imageUrl}`} />
                    ) : (
                            <Avatar className={classes.largeAvatar}>
                                <ImageOutlined />
                            </Avatar>
                        )}
                </div>

                <div className="job-listing-description">
                    <h4 className="job-listing-company">{data.company?.[0]?.name}</h4>
                    <h3 className="job-listing-title">{data.title}</h3>
                </div>
            </div>

            <div className="job-listing-footer">
                {(isInitial(saveBookmark) ||
                    isSuccess(saveBookmark)) && (
                        <span
                            className={`bookmark-icon ${bookmarked ? 'bookmarked' : ''}`}
                            onClick={(event) => {
                                event.preventDefault();
                                setSave(() => !bookmarked ?
                                    BookmarkService.save({ type: 'POST', post: { id: data.id } as IPost, jobseeker: null })
                                    : BookmarkService.delete(!isInitial(saveBookmark) ? saveBookmark.data.id : data.bookmark.id));
                            }}
                        />
                    )}
                {isPending(saveBookmark) &&
                    <CircularProgress style={{
                        position: 'absolute',
                        top: '-18px',
                        right: 25,
                        color: '#2b41e8',
                    }}
                        size="2.3rem"
                        color="primary"
                    />
                }
                <ul>
                    <li>
                        <i className="icon-material-outline-location-on" />{' '}
                        {data.location?.city ? data.location?.city : <>&mdash;</>}
                    </li>
                    <li>
                        <i className="icon-material-outline-business-center" /> {t(`JobType.${data.type}`)}
                    </li>
                    <li>
                        <i className="icon-material-outline-account-balance-wallet" /> {data.minEstimatedBudget}
                        {data.minEstimatedBudget === null && data.maxEstimatedBudget === null ? <>&mdash;</> : '-'}
                        {data.maxEstimatedBudget || ''}
                        {` ${data.currency}`}
                    </li>
                    <li>
                        <i className="icon-material-outline-access-time" />
                        {moment.utc(data.createdAt).local().format('DD.MM.YYYY')}
                    </li>
                </ul>
            </div>
        </Link>
    );
};

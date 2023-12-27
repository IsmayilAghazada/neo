import { makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    text: { display: 'inline-block' },
}));
export const JobItemSkeleron: React.FC = () => {
    const { location } = useHistory();
    const classes = useStyles();

    return (
        <Link to={location} className="job-listing">
            <div className="job-listing-details">
                <div className="job-listing-company-logo">
                    <Skeleton className={classes.largeAvatar} variant="circle" />
                </div>

                <div className="job-listing-description">
                    <h4 className="job-listing-company">
                        <Skeleton variant="text" className={classes.text} width={100} height={20} />
                    </h4>
                    <h3 className="job-listing-title">
                        <Skeleton variant="text" className={classes.text} width={150} height={20} />
                    </h3>
                </div>
            </div>

            <div className="job-listing-footer">
                <span className="bookmark-icon" />
                <ul>
                    <li>
                        <i className="icon-material-outline-location-on" />{' '}
                        <Skeleton variant="text" className={classes.text} width={150} height={20} />
                    </li>
                    <li>
                        <i className="icon-material-outline-business-center" />{' '}
                        <Skeleton variant="text" className={classes.text} width={100} height={20} />
                    </li>
                    <li>
                        <i className="icon-material-outline-account-balance-wallet" />{' '}
                        <Skeleton variant="text" className={classes.text} width={50} height={20} />-
                        <Skeleton variant="text" className={classes.text} width={50} height={20} />{' '}
                        <Skeleton variant="text" className={classes.text} width={30} height={20} />
                    </li>
                    <li>
                        <i className="icon-material-outline-access-time" />
                        <Skeleton variant="text" className={classes.text} width={50} height={20} />
                    </li>
                </ul>
            </div>
        </Link>
    );
};

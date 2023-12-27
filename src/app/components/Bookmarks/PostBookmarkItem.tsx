import {
    Avatar,
    Box,
    createMuiTheme,
    Grid,
    IconButton,
    List,
    ListItem,
    makeStyles,
    MuiThemeProvider,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { BusinessCenterOutlined, DeleteOutline, QueryBuilderOutlined, RoomOutlined } from '@material-ui/icons';
import React from 'react';
import { red } from '@material-ui/core/colors';
import { BACKEND_BASE_URL } from 'consts';
import { useAsyncData } from 'app/hooks';
import { isPending, isSuccess } from 'utils';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { IBookmark } from 'app/models/Bookmark';
import { BookmarkService } from 'app/services/Bookmark';
import { ROUTES } from 'app/routes/consts';
import { makePath } from 'utils/router';
import { Link } from 'react-router-dom';

const redTheme = createMuiTheme({ palette: { primary: red } });
const useStyles = makeStyles((theme) => ({
    subRoot: {
        flexGrow: 1,
        backgroundColor: '#fff',
        margin: 0,
    },
    paper: {
        border: 'none',
        boxShadow: 'none',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: '30px 12px 30px 20px',
        color: '#2a41e8',
        flex: '0 0 100%',
        borderLeft: '3px solid transparent',
        '&:hover': {
            borderLeft: '3px solid #2a41e8',
            borderRadius: '3px 3px 0 0',
        },
    },
    action: {
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 160,
        },
    },
    description: { flexGrow: 1 },
    image: { width: 100, maxHeight: 128 },
    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

interface IProps {
    bookmark: IBookmark;
    index: number;
    onRemove: (index: number) => void;
}

export const PostBookmarkItem: React.FC<IProps> = ({ bookmark, onRemove, index }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation(['Profile', 'Common']);
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const [deleteBookmark, setDeleted] = useAsyncData<IBookmark>();

    const handleDelete = () => {
        setDeleted(() => BookmarkService.delete(bookmark.id));
    };

    React.useEffect(() => {
        if (isSuccess(deleteBookmark)) {
            onRemove(index);
        }
    }, [deleteBookmark]);

    return (
        <Paper className={classes.paper}>
            <Grid container className={classes.subRoot} spacing={1}>
                <List
                    style={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'space-between',
                        flexWrap: !isDesktop ? 'wrap-reverse' : 'nowrap',
                        alignItems: 'center',
                    }}
                >
                    {isDesktop && (
                        <Grid item className={classes.image}>
                            <Link to={makePath(ROUTES.VIEW_JOB.PATH, { id: bookmark.post?.id })}>
                                {!bookmark?.post?.user?.imageUrl?.length ? (
                                    <Avatar className={classes.largeAvatar}>
                                        <BusinessCenterOutlined />
                                    </Avatar>
                                ) : (
                                    <Avatar
                                        src={`${BACKEND_BASE_URL}/${bookmark?.post?.user?.imageUrl}`}
                                        className={classes.largeAvatar}
                                    />
                                )}
                            </Link>
                        </Grid>
                    )}
                    <ListItem style={isDesktop ? { padding: 0 } : { padding: '12px 0' }}>
                        <Grid item className={classes.description}>
                            <div className="job-listing-description">
                                <Typography component="div" variant="body1">
                                    <Box color="#333" fontWeight="fontWeightBold">
                                        {`${bookmark?.post?.title}`}
                                    </Box>
                                </Typography>
                                <div>
                                    <List>
                                        <ListItem style={{ padding: 0 }}>
                                            <Grid item xs={12}>
                                                <Grid container justify="flex-start" spacing={2}>
                                                    <Grid
                                                        alignItems="center"
                                                        item
                                                        style={{
                                                            color: '#777',
                                                            display: 'inline-flex',
                                                            padding: 0,
                                                        }}
                                                    >
                                                        <RoomOutlined />
                                                        <Box marginLeft={1} fontWeight="fontWeightBold">
                                                            {bookmark.post?.location?.city ? (
                                                                `${bookmark.post?.location?.city}, ${bookmark.post?.location?.country}`
                                                            ) : (
                                                                <>&mdash;</>
                                                            )}
                                                        </Box>
                                                    </Grid>
                                                    <Grid
                                                        spacing={1}
                                                        alignItems="center"
                                                        item
                                                        style={{ color: '#777', display: 'inline-flex' }}
                                                    >
                                                        <BusinessCenterOutlined />
                                                        <Box marginLeft={1} fontWeight="fontWeightBold">
                                                            {t(`Common:JobType.${bookmark.post?.type}`)}
                                                        </Box>
                                                    </Grid>
                                                    <Grid
                                                        spacing={1}
                                                        alignItems="center"
                                                        item
                                                        style={{ color: '#777', display: 'inline-flex' }}
                                                    >
                                                        <QueryBuilderOutlined />
                                                        <Box marginLeft={1} fontWeight="fontWeightBold">
                                                            {moment
                                                                .utc(bookmark.post?.createdAt)
                                                                .local()
                                                                .format('DD.MM.YYYY')}
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    </List>
                                </div>
                            </div>
                        </Grid>
                    </ListItem>
                    <ListItem
                        style={
                            isDesktop
                                ? { justifyContent: 'flex-end', alignSelf: 'baseline', width: 200, padding: 0 }
                                : {
                                      display: 'flex',
                                      flex: 1,
                                      alignSelf: 'baseline',
                                      justifyContent: 'space-between',
                                      padding: 0,
                                  }
                        }
                    >
                        {!isDesktop && (
                            <Grid item className={classes.image}>
                                <Link to={makePath(ROUTES.VIEW_JOB.PATH, { id: bookmark.post?.id })}>
                                    {!bookmark.post?.user?.imageUrl?.length ? (
                                        <Avatar className={classes.largeAvatar}>
                                            <BusinessCenterOutlined />
                                        </Avatar>
                                    ) : (
                                        <Avatar
                                            src={`${BACKEND_BASE_URL}/${bookmark.post?.user?.imageUrl}`}
                                            className={classes.largeAvatar}
                                        />
                                    )}
                                </Link>
                            </Grid>
                        )}
                        <Grid
                            style={!isDesktop ? { display: 'flex', justifyContent: 'flex-end' } : {}}
                            item
                            className={classes.action}
                        >
                            <MuiThemeProvider theme={redTheme}>
                                <IconButton
                                    disabled={isPending(deleteBookmark)}
                                    onClick={handleDelete}
                                    color="secondary"
                                    aria-label="edit"
                                >
                                    <DeleteOutline />
                                </IconButton>
                            </MuiThemeProvider>
                        </Grid>
                    </ListItem>
                </List>
            </Grid>
        </Paper>
    );
};
PostBookmarkItem.displayName = 'PostBookmarkItem';

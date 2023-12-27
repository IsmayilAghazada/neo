import {
    Avatar,
    Box,
    Collapse,
    createMuiTheme,
    Divider,
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
import {
    BusinessCenterOutlined,
    DeleteOutline,
    Edit,
    ExpandLess,
    ExpandMore,
    LocationCity,
    QueryBuilderOutlined,
} from '@material-ui/icons';
import { IExperience } from 'app/models/JobSeeker';
import { ROUTES } from 'app/routes/consts';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { red } from '@material-ui/core/colors';
import { BACKEND_BASE_URL } from 'consts';
import { useAsyncData } from 'app/hooks';
import { ExperienceService } from 'app/services/JobSeeker/Experience';
import { isPending, isSuccess } from 'utils';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ProfileContext } from '../ProfileContext';

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
    experience: IExperience;
    index: number;
    onRemove: (index: number) => void;
    onEdit: (index: number) => void;
}

export const ExperienceItem: React.FC<IProps> = ({ experience, onRemove, index, onEdit }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation(['Profile', 'Common']);
    const {
        location: { pathname },
    } = useHistory();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const { clientData } = React.useContext(ProfileContext);
    const [open, setOpen] = React.useState(false);
    const [deleteExpereince, setDeleted] = useAsyncData<void>();

    const handleDelete = () => {
        setDeleted(() => ExperienceService.delete(clientData.data.id, experience.id));
    };

    React.useEffect(() => {
        if (isSuccess(deleteExpereince)) {
            onRemove(index);
        }
    }, [deleteExpereince]);

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
                            {!experience?.companyUser?.imageUrl?.length ? (
                                <Avatar className={classes.largeAvatar}>
                                    <BusinessCenterOutlined />
                                </Avatar>
                            ) : (
                                <Avatar
                                    src={`${BACKEND_BASE_URL}/${experience?.companyUser?.imageUrl}`}
                                    className={classes.largeAvatar}
                                />
                            )}
                        </Grid>
                    )}
                    <ListItem style={isDesktop ? { padding: 0 } : { padding: '12px 0' }}>
                        <Grid item className={classes.description}>
                            <div className="job-listing-description">
                                <Typography component="div" variant="body1">
                                    <Box color="#333" fontWeight="fontWeightBold">
                                        {`${experience.title} `}
                                        <>&mdash;</>
                                        {` ${experience.companyName}`}
                                    </Box>
                                </Typography>
                                <div>
                                    <List>
                                        <ListItem style={{ padding: 0 }}>
                                            <Grid item xs={12}>
                                                <Grid container justify="flex-start" spacing={2}>
                                                    <Grid
                                                        item
                                                        style={{
                                                            color: '#777',
                                                            alignItems: 'center',
                                                            display: 'inline-flex',
                                                        }}
                                                    >
                                                        <LocationCity />
                                                        <Box marginLeft={1} fontWeight="fontWeightBold">
                                                            {experience.companyName}
                                                        </Box>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        style={{
                                                            color: '#777',
                                                            alignItems: 'center',
                                                            display: 'inline-flex',
                                                        }}
                                                    >
                                                        <BusinessCenterOutlined />
                                                        <Box marginLeft={1} fontWeight="fontWeightBold">
                                                            {t(`Common:JobType.${experience.jobType}`)}
                                                        </Box>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        style={{
                                                            color: '#777',
                                                            alignItems: 'center',
                                                            display: 'inline-flex',
                                                        }}
                                                    >
                                                        <QueryBuilderOutlined />
                                                        <Box marginLeft={1} fontWeight="fontWeightBold">
                                                            {`${
                                                                experience.startingDate
                                                                    ? moment(
                                                                          experience.startingDate,
                                                                          'YYYY-MM-DD',
                                                                      ).format('DD.MM.YYYY')
                                                                    : ''
                                                            } `}
                                                            <>&mdash;</>
                                                            {` ${
                                                                experience.endDate
                                                                    ? moment(experience.endDate, 'YYYY-MM-DD').format(
                                                                          'DD.MM.YYYY',
                                                                      )
                                                                    : t('Common:present')
                                                            }`}
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                        {open && <Divider style={{ margin: 8 }} light />}
                                        <ListItem style={{ padding: 0 }}>
                                            <Collapse in={open} timeout="auto" unmountOnExit>
                                                <Grid item xs={12}>
                                                    <Grid container justify="flex-start" spacing={2}>
                                                        <Grid
                                                            item
                                                            style={{
                                                                color: '#333',
                                                                alignItems: 'center',
                                                                display: 'inline-flex',
                                                            }}
                                                        >
                                                            <Box
                                                                marginLeft={1}
                                                                component="div"
                                                                fontWeight="fontWeightLight"
                                                            >
                                                                {experience.description}
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Collapse>
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
                                {!experience?.companyUser?.imageUrl?.length ? (
                                    <Avatar className={classes.largeAvatar}>
                                        <BusinessCenterOutlined />
                                    </Avatar>
                                ) : (
                                    <Avatar
                                        src={`${BACKEND_BASE_URL}/${experience?.companyUser?.imageUrl}`}
                                        className={classes.largeAvatar}
                                    />
                                )}
                            </Grid>
                        )}
                        <Grid
                            style={!isDesktop ? { display: 'flex', justifyContent: 'flex-end' } : {}}
                            item
                            className={classes.action}
                        >
                            {pathname === ROUTES.PROFILE.PATH && (
                                <>
                                    <IconButton onClick={() => setOpen(!open)} color="secondary" aria-label="edit">
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                    <IconButton
                                        disabled={isPending(deleteExpereince)}
                                        onClick={() => onEdit(index)}
                                        color="secondary"
                                        aria-label="edit"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <MuiThemeProvider theme={redTheme}>
                                        <IconButton
                                            disabled={isPending(deleteExpereince)}
                                            onClick={handleDelete}
                                            color="secondary"
                                            aria-label="edit"
                                        >
                                            <DeleteOutline />
                                        </IconButton>
                                    </MuiThemeProvider>
                                </>
                            )}
                        </Grid>
                    </ListItem>
                </List>
            </Grid>
        </Paper>
    );
};
ExperienceItem.displayName = 'ExperienceItem';

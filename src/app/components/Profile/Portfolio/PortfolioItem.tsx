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
import { DeleteOutline, Edit, ExpandLess, ExpandMore, LinkOutlined, WorkOutline } from '@material-ui/icons';
import { IPortfolio } from 'app/models/JobSeeker';
import { ROUTES } from 'app/routes/consts';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { red } from '@material-ui/core/colors';
import { useAsyncData } from 'app/hooks';
import { isPending, isSuccess } from 'utils';
import { PortfolioService } from 'app/services/JobSeeker/Portfolio';
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
        padding: '12px 12px 12px 20px',
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
    portfolio: IPortfolio;
    index: number;
    onRemove: (index: number) => void;
    onEdit: (index: number) => void;
}

export const PortfolioItem: React.FC<IProps> = ({ portfolio, onRemove, index, onEdit }) => {
    const classes = useStyles();
    const theme = useTheme();
    const {
        location: { pathname },
    } = useHistory();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const { clientData } = React.useContext(ProfileContext);
    const [deletePortfolio, setDeleted] = useAsyncData<void>();
    const handleDelete = () => {
        setDeleted(() => PortfolioService.delete(clientData.data.id, portfolio.id));
    };
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        if (isSuccess(deletePortfolio)) {
            onRemove(index);
        }
    }, [deletePortfolio]);
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
                            <Avatar className={classes.largeAvatar}>
                                <WorkOutline />
                            </Avatar>
                        </Grid>
                    )}
                    <ListItem style={isDesktop ? { padding: 0 } : { padding: '12px 0' }}>
                        <Grid item className={classes.description}>
                            <div className="job-listing-description">
                                <Typography component="div" variant="body1">
                                    <Box color="#333" fontWeight="fontWeightBold">
                                        {`${portfolio.title} `}
                                    </Box>
                                </Typography>
                                <div>
                                    <List style={{ padding: 0 }}>
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
                                                        {portfolio.websiteUrl && (
                                                            <>
                                                                <LinkOutlined />
                                                                <a
                                                                    rel="noreferrer noopener"
                                                                    target="_blank"
                                                                    href={portfolio.websiteUrl}
                                                                    style={{ marginLeft: 8 }}
                                                                >
                                                                    {portfolio.websiteUrl}
                                                                </a>
                                                            </>
                                                        )}
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
                                                                {portfolio.description}
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
                                <Avatar className={classes.largeAvatar}>
                                    <WorkOutline />
                                </Avatar>
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
                                        disabled={isPending(deletePortfolio)}
                                        onClick={() => onEdit(index)}
                                        color="secondary"
                                        aria-label="edit"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <MuiThemeProvider theme={redTheme}>
                                        <IconButton
                                            disabled={isPending(deletePortfolio)}
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
PortfolioItem.displayName = 'PortfolioItem';

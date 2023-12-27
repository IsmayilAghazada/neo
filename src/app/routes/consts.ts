export const ROUTES = {
    HOME: {
        PATH: '/home',
    },
    PROFILE: {
        PATH: '/profile',
        VIEW_OTHER: { PATH: '/profile/:id' },
    },
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
        CONFIRM_ACCOUNT: '/confirm-account/:token',
        RESET_PASSWORD: '/reset/:token',
        LOGOUT: '/logout',
    },
    CONTACT: {
        PATH: '/contact',
    },
    ABOUT: '/about',
    PRIVACY_POLICE: '/legal/privacy-police',
    BOOKMARKS: {
        PATH: '/bookmarks',
    },
    JOBS: {
        PATH: '/jobs',
    },
    COMPANIES: {
        PATH: '/companies',
    },
    MANAGE_JOBS: {
        PATH: '/manage-jobs',
    },
    JOBSEEKERS: {
        PATH: '/jobseekers',
    },
    POST_JOB: {
        PATH: '/post-job',
    },
    EDIT_JOB: {
        PATH: '/edit-job/:id',
    },
    VIEW_JOB: {
        PATH: '/view-job/:id',
    },
    EMPLOYEES: {
        PATH: '/employees',
    },
    // DASHBOARD: {
    //     PATH: '/dashboard',
    // },
    PATH: '/',
};

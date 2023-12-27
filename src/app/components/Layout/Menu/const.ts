interface IMenu {
    to: string;
    name: string;
    subRoutes?: Array<{ to: string; name: string }>;
}

export const MENUS: IMenu[] = [
    { to: '/home', name: 'home' },
    {
        to: '/job',
        name: 'jobs',
        subRoutes: [
            { to: '/jobs', name: 'browse_jobs' },
            // { to: '/tasks', name: 'Browse Tasks' },
            { to: '/companies', name: 'browse_companies' },
        ],
    },
    {
        to: '/employee',
        name: 'employees',
        subRoutes: [
            { to: '/employees', name: 'browse_jobseekers' },
            { to: '/manage-jobs', name: 'manage_jobs' },
            { to: '/post-job', name: 'post_a_job' },
        ],
    },
    { to: '/contact', name: 'contact' },
];

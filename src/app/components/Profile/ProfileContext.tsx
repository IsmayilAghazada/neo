import { IUser } from 'app/deps/userService/model';
import { ICompany } from 'app/models/Company';
import { IJobSeeker } from 'app/models/JobSeeker';
import { IRecruiter } from 'app/models/Recruiter';
import { IAsyncData } from 'model';
import React from 'react';

export const ProfileContext = React.createContext<{
    userData?: IAsyncData<IUser>;
    clientData?: IAsyncData<IJobSeeker | ICompany | IRecruiter>;
}>({});

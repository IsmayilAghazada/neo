import { httpClient } from 'app/deps';
import { ISkill } from 'app/models/Skill';
import { IPaginatedData } from 'model';

export const BASE_SKILL_URL = '/skill';
export const SkillService = {
    getList(name = ''): Promise<IPaginatedData<ISkill>> {
        const url = `${BASE_SKILL_URL}/list?${Object.entries({ ...(Boolean(name) && { name }) })
            .toString()
            .replace(',', '=')}`;
        return httpClient.get(url);
    },
};

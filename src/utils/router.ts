import * as pathToRegexp from 'path-to-regexp';

/**
 * Transform a string into a valid path.
 */
export const makePath = (path: string, params: any): string => pathToRegexp.compile(path)(params);

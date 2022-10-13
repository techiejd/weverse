import * as dbSchemas from '../db/schemas';
  
export const makeUserNameQueryFilter = (queries: Array<string>) => (u: dbSchemas.UserData) : boolean => {
  return queries.some(
    (query) => u.name.toLowerCase().includes(query.toLowerCase()))
}
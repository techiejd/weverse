import * as dbSchemas from '../db/schemas';

export const makeQueryUsersSnapshot = (queries: Array<string>) => (
  usersSnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>) => {
    const usersFound = Array<dbSchemas.UserData>();
    for (const userDoc of usersSnapshot.docs) {
      const user = dbSchemas.userData.parse(userDoc.data());
      const userFound = queries.some(
          (query) => user.name.toLowerCase().includes(query.toLowerCase()));
      if (userFound) {
        usersFound.push(user);
      }
    }
    return usersFound;
  };
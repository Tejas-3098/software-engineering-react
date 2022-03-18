import {
createTuit, updateTuit, findTuitById, deleteTuit
} from "../services/tuits-service";

import {
createUser,
  deleteUsersByUsername, findAllUsers,
  findUserById
} from "../services/users-service";


describe('can create tuit with REST API', () => {
  const tony = {
     username: 'tonystark',
     password: 'iamironman',
     email: 'starktony@marvel.com'
  };
  const newTuit = {
     tuit: "You can take away my house, all my tricks and toys.One thing you can't take away...I am Ironman",
     postedBy: "tonystark"
  };

  beforeAll(() => {
     // remove any/all users to make sure we create it in the test
     return deleteUsersByUsername(tony.username);
   })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(tony.username);
  })

  test('can insert new tuits with REST API', async () => {
    // insert new user in the database
    const newUser = await createUser(tony);
    const createdTuit = await createTuit(newUser._id, newTuit.tuit);
    //verify that inserted tuit matches parameter tuit
    expect(createdTuit.tuit).toEqual(newTuit.tuit);
    expect(createdTuit.postedBy).toEqual(newTuit.postedBy);
  });

import { async } from "regenerator-runtime";
import {
createTuit, updateTuit, findTuitById, deleteTuit, findAllTuits
} from "../services/tuits-service";

import {
createUser,
  deleteUsersByUsername, findAllUsers,
  findUserById
} from "../services/users-service";
import { deleteUser } from "./services";


describe('can create tuit with REST API', () => {
  //sample user who creates the tuit
  const tony = {
     username: 'tonystark',
     password: 'iamironman',
     email: 'starktony@marvel.com'
  };
  //sample tuit
  const newTuit = {
     tuit: "You can take away my house, all my tricks and toys.One thing you can't take away...I am Ironman"
  };

  var tuitId = null;
  beforeAll(async() => {
    // remove any/all users to make sure we create it in the test
    return await deleteUsersByUsername(tony.username);
  })

  // clean up after test runs
  afterAll(async() => {
    // remove any data we created
    await deleteUsersByUsername(tony.username);
    await deleteTuit(tuitId);
  })

  test('can insert new tuits with REST API', async () => {
    //Creating a new user
    const createdUser1 = await createUser(tony);
    //Checking whether the user gets created properly
    expect(createdUser1.username).toEqual(tony.username);
    expect(createdUser1.password).toEqual(tony.password);
    expect(createdUser1.email).toEqual(tony.email);

    //Storing the created user id so that we can use it to create a tuit
    const createdUserId = createdUser1._id;

    //Using that user id to create the tuit
    const createdTuit1 = await createTuit(createdUserId, newTuit);

    //Storing the created tuit's id in a variable so that it can be used to delete tuit after the test
    tuitId = createdTuit1._id;

    //Verifying that the properties of new tuit match with the ones we inserted
    expect(createdTuit1.tuit).toEqual(newTuit.tuit);
    expect(createdTuit1.postedBy).toEqual(createdUserId); 
  });
});

describe('can delete tuit with REST API', () => {

  
  //sample user who posts tuits
  const spidey = {
    username: 'spiderman',
    password: 'iamspidey1234',
    email: 'spidey@nowayhome.com'
  };
  //sample tuit 
  const spideyTuit = {
    tuit: "Now the whole world knows that I am spider man"
  };

  var tuitId = null;

  // setup the tests before verification
  beforeAll(async() => {
    await deleteUsersByUsername(spidey.username);
  });

  // clean up after test runs
  afterAll(async() => {
    // remove any data we created
    await deleteUsersByUsername(spidey.username);
    await deleteTuit(tuitId);
  });

  test('can delete tuit using REST API', async () => {
    const newSpideyUser = await createUser(spidey);
    expect(newSpideyUser.username).toEqual(spidey.username);
    expect(newSpideyUser.password).toEqual(spidey.password);
    expect(newSpideyUser.email).toEqual(spidey.email);
    
    //Creating a new tuit for the user and checking
    const spideyUserId = newSpideyUser._id;
    const newSpideyTuit = await createTuit(spideyUserId, spideyTuit);
    tuitId = newSpideyTuit._id;
    expect(newSpideyTuit.tuit).toEqual(spideyTuit.tuit);  

    const status = await deleteTuit(tuitId);
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
  //let thanosUser;
  //let thanosTuit;
  //sample user
  const thanos = {
    username: 'iamthanos',
    password: 'destroyer123',
    email: 'thanos@endgame.com'
  }; 

  const thanosTuit = {
    tuit: "Dread it, run from it, destiny arrives all the same"
  };

  var tuitId1 = null;
  // setup the tests before verification
  beforeAll(async() => {
  // insert the sample user we then try to remove
    //thanosUser = createUser(thanos);
    //thanosTuit = createTuit(thanosUser._id, hisTuit.tuit);
    await deleteUsersByUsername(thanos.username);
  });

  // clean up after test runs
  afterAll(async() => {
    // remove any data we created
    await deleteUsersByUsername(thanos.username);
    await deleteTuit(tuitId1);
  });
  
  test('can retrieve tuit using primary key', async () => {
    const thanosUser = await createUser(thanos);
    expect(thanosUser.username).toEqual(thanos.username);
    expect(thanosUser.password).toEqual(thanos.password);
    expect(thanosUser.email).toEqual(thanos.email);

    const newThanosTuit = await createTuit(thanosUser._id, thanosTuit);
    //verify new tuit matches paramater tuit
    expect(newThanosTuit.tuit).toEqual(thanosTuit.tuit);
    expect(newThanosTuit.postedBy).toEqual(thanosUser._id);
    tuitId1 = newThanosTuit._id;
    
    //Retrieve the newly created tuit and check if it is the one which was created
    const retrievedTuit = findTuitById(newThanosTuit._id);
    expect(retrievedTuit._id).toEqual(newThanosTuit._id); 
    expect(retrievedTuit.tuit).toEqual(newThanosTuit.tuit);

  });
});

describe('can retrieve all tuits with REST API', () => {
  //sample user
  let hawkeyeUser;
  const hawkeye = {
    username: 'iamclint',
    password: 'bestaim123',
    email: 'clintbarton@marvel.com'
  }; 
  const hardcoded_tuits = [
    {_id: 1, tuit: 'Hawkeye is back!', postedBy: {username: 'iamclint', password: 'bestaim123', email: 'clintbarton@marvel.com', _id: "123"}}, 
    {_id: 2, tuit: 'Its good to be back to social media', postedBy: {username: 'iamclint', password: 'bestaim123', email: 'clintbarton@marvel.com', _id: "145"}},
    {_id: 3, tuit: 'The weather in Boston is so good today!', postedBy: {username: 'iamclint', password: 'bestaim123', email: 'clintbarton@marvel.com', _id: "200"}} 
  ]

  beforeAll(() => {
    hawkeyeUser = createUser(hawkeye);
  })

  afterAll(() => {
    deleteUsersByUsername(hawkeye.username);
  })

  test('retrieve all tuits from REST API', async () => {
    const tuits = await findAllTuits();
    expect(tuits.length).toBeGreaterThanOrEqual(hardcoded_tuits.length);
    const tuitsByUser = tuits.filter(tuit => hardcoded_tuits.indexOf(tuit._id) >= 0);
    //For each tuit received checking if the properties match with the ones we created
    tuitsByUser.forEach(tuit => {
      expect(tuit._id).toEqual(hardcoded_tuits._id);
      expect(tuit.tuit).toEqual(hardcoded_tuits.tuit);
      expect(tuit.postedBy).toEqual(hardcoded_tuits.postedBy);
    })
  })
})

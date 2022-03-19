import {
createTuit, updateTuit, findTuitById, deleteTuit, findAllTuits
} from "../services/tuits-service";

import {
createUser,
  deleteUsersByUsername, findAllUsers,
  findUserById
} from "../services/users-service";


describe('can create tuit with REST API', () => {
  //sample user who creates the tuit
  const tony = {
     username: 'tonystark',
     password: 'iamironman',
     email: 'starktony@marvel.com'
  };
  //sample tuit
  const newTuit = {
     tuit: "You can take away my house, all my tricks and toys.One thing you can't take away...I am Ironman",
     postedBy: tony
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
});

describe('can delete tuit wtih REST API', () => {
  //sample 
  let spideyTuit;
  const spidey = {
    username: 'spiderman',
    password: 'iamspidey1234',
    email: 'spidey@nowayhome.com'
  };
  const newTuit = {
    tuit: "Now the whole world knows that I am spider man",
    postedBy: spidey
  };

  // setup the tests before verification
  beforeAll(() => {
  // insert the sample user we then try to remove
    const spideyUser = createUser(spidey);
    spideyTuit = createTuit(spideyUser._id, newTuit.tuit);
  });

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    deleteUsersByUsername(spidey.username);
    deleteTuit(spideyTuit._id);
  });

  test('can delete tuit using tid', async () => {
    // delete a tuit by tid. Assumes tuit already exists
    const status = await deleteTuit(spideyTuit._id);  
    // verify we deleted at least one user by their username
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
  let thanosUser;
  let thanosTuit;
  //sample user
  const thanos = {
    username: 'iamthanos',
    password: 'destroyer123',
    email: 'thanos@endgame.com'
  }; 

  const hisTuit = {
    tuit: "Dread it, run from it, destiny arrives all the same",
    postedBy: thanos
  };

  // setup the tests before verification
  beforeAll(() => {
  // insert the sample user we then try to remove
    thanosUser = createUser(thanos);
    //thanosTuit = createTuit(thanosUser._id, hisTuit.tuit);
  });

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    return deleteUsersByUsername(thanos.username);
  });
  
  test('can retrieve tuit using primary key', async () => {
    thanosUser = createUser(thanos);
    thanosTuit = createTuit(thanosUser._id, hisTuit.tuit);
    //verify new tuit matches paramater tuit
    expect(thanosTuit.tuit).toEqual(hisTuit.tuit);
    expect(thanosTuit.postedBy).toEqual(hisTuit.postedBy);

    const postedTuit = findTuitById(thanosUser._id);

    //verify retrieved tuit matches parameter tuit
    expect(postedTuit.tuit).toEqual(hisTuit.tuit);
    expect(postedTuit.postedBy).toEqual(hisTuit.postedBy);
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
  });
});

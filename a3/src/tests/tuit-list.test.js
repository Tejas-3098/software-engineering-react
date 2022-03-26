import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";

jest.mock('axios');

const MOCKED_USERS = [
"alice", "bob", "charlie"
];

const NEW_MOCKED_USERS = [
  {username: 'alice', password: 'alice123', email: 'alice@wonderland.com', _id: "123"},
  {username: 'bob', password: 'iambob1998', email: 'bob@gmail.com', _id: "155"},
  {username: 'charlie', password: 'charlie88', email: 'charlie@hotmail.com', _id: "200"}
]

const MOCKED_TUITS = [
  "alice's tuit", "bob's tuit", "charlie's tuit"
];

const NEWLY_MOCKED_TUITS = [
  {_id: 1, tuit: 'Hello everyone, I am Alice and I am new to tuiter', postedBy: {username: 'alice', password: 'alice123', email: 'alice@wonderland.com', _id: "123"}}, 
  {_id: 2, tuit: 'Hey! Bob here from Boston', postedBy: {username: 'bob', password: 'iambob1998', email: 'bob@gmail.com', _id: "155"}},
  {tuit: 'The weather in Boston is so good today!', postedBy: {username: 'charlie', password: 'charlie88', email: 'charlie@hotmail.com', _id: "200"}} 
]

test('tuit list renders static tuit array', () => {
  // TODO: implement this
  render(
    <HashRouter>
      <Tuits tuits = {NEWLY_MOCKED_TUITS}/>
    </HashRouter>);
  const linkElement = screen.getByText(/The weather in Boston is so good today!/i);
  expect(linkElement).toBeInTheDocument();   
});

test('tuit list renders mocked', async () => {
  axios.get.mockImplementation(() =>
    Promise.resolve({ data: {tuits: NEWLY_MOCKED_TUITS} }));
  const response = await findAllTuits();
  const tuits = response.tuits;

  render(
    <HashRouter>
      <Tuits tuits={tuits}/>
    </HashRouter>);

  const user = screen.getByText(/The weather in Boston is so good today!/i);
  expect(user).toBeInTheDocument();
});

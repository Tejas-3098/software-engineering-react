import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";

test('tuit list renders async', async () => {
    const tuits = await findAllTuits();
    render(
      <HashRouter>
        <Tuits tuits={tuits}/>
      </HashRouter>);
    //checking if the screen renders an already existing tuit  
    const linkElement = screen.getByText(/Working on an exciting adventure movie for Sony Pictures/i);
    expect(linkElement).toBeInTheDocument();
})  
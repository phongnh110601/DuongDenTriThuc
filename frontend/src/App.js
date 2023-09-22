import Admin from './page/admin';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from './page/player';
import AnswerBoard from './component/player/answerBoard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/player' element={<Player/>}/>

      </Routes>
    </BrowserRouter>
    // <AnswerBoard users={
    //   [
    //     {
    //       name: "Phong",
    //       answer: 'b',
    //       answerTime: 1.02,
    //       correct: true
    //     },
    //     {
    //       name: "Phong",
    //       answer: 'b',
    //       answerTime: 1.02,
    //       correct: true
    //     },
    //     {
    //       name: "Phong",
    //       answer: 'b',
    //       answerTime: 1.02,
    //       correct: true
    //     },
    //     {
    //       name: "Phong",
    //       answer: 'b',
    //       answerTime: 1.02,
    //       correct: true
    //     }
    //   ]
    // } />
  );
}

export default App;

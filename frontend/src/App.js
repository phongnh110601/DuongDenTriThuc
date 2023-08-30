import Admin from './page/admin';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Player from './page/player';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/player' element={<Player/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

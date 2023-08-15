// import logo from './logo.svg';
// import './App.css';
import Admin from './component/Admin';
import Test from './component/Test';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Test/>}/>
        <Route path='/admin' element={<Admin/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

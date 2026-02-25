import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LibraryPage from './LibraryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La route "/" charge votre page LibraryPage */}
        <Route path="/" element={<LibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
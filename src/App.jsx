import UpdateItem from "./components/UpdateItem";

// use the following link to get the data
// `/doors` will give you all the doors, to get a specific door use `/doors/1`.
const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;

function App() {
  return (
    <div className="app-container">
      <h1>Door Management System</h1>
      <UpdateItem />
    </div>
  );
}

export default App;

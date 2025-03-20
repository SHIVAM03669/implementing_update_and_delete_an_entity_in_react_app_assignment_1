import UpdateItem from "./components/UpdateItem";
import DeleteItem from "./components/DeleteItem";

// use the following link to get the data
// `/doors` will give you all the doors, to get a specific door use `/doors/1`.
const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;

function App() {
  return (
    <div className="app-container">
      <h1>Door Management System</h1>
      <div className="components-container">
        <UpdateItem />
        <DeleteItem />
      </div>
    </div>
  );
}

export default App;

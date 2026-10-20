import Header from "./components/Header.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Header
        userName="Estate Owner"
        userRole="Owner"
        estateName="All estates"
        alertCount={3}
        iotOnline
      />
      <main className="app-main">
        <h1>Welcome to Estate360</h1>
        <p>
          Centralized IoT-enabled estate management for attendance, harvest,
          wages, and field conditions.
        </p>
      </main>
    </div>
  );
}

export default App;

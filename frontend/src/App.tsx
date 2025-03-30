import Navbar from "./layouts/Navbar";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <>
      <div className="font-serif">
        <Navbar>
          <Homepage />{" "}
        </Navbar>
      </div>
    </>
  );
}

export default App;

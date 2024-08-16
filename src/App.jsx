import "./App.css";

function App() {
  const clickHandel = () => {
    const x = localStorage.removeItem("name");
  };

  return (
    <>
      <div>Hi there</div>

      <div>
        <button onClick={clickHandel}>Set to local Storage</button>
      </div>
    </>
  );
}

export default App;

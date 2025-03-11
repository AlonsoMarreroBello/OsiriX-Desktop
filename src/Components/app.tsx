import Button from "@mui/material/Button";
import TitleBar from "./titleBar";

const App = () => {
  return (
    <div>
      <TitleBar />
      <div className="container">
        <h1>Este es un test para nuestro portal de aplicaciones</h1>
        <Button
          onClick={() => console.log("BOTON PULSADO")}
          variant="contained"
          sx={{ backgroundColor: "red" }}
        >
          Test Button
        </Button>
      </div>
    </div>
  );
};

export default App;

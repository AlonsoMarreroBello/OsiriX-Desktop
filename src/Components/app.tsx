import TitleBar from "./TitleBar/TitleBar";
import Header from "./Header/Header";
import HomePage from "../pages/home/HomePage";

const App = () => {
  return (
    <div>
      <TitleBar />
      <Header username="TuPrima" />
      <div>
        <HomePage />
      </div>
    </div>
  );
};

export default App;

import ParticlesComponent from "./components/Background";
import Card from "./components/Card";
import data from "../src/api/data.json";
const App = () => {
  return (
    <>
      <div id="parent">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/8/87/RUET_logo.svg/1200px-RUET_logo.svg.png"
          alt="ruet logo"
          id="logo"
        />
      </div>
      <div>
        <h1 className="heading">ECE-23 DETAILS</h1>
      </div>
      <ParticlesComponent id="particles" />
      <div id="parent">
        {data.map((elem, index) => {
          return <Card key={index} currElem={elem} />;
        })}
      </div>
      <div className="footer">
        <p>
          Developed by
          <a
            href="https://www.facebook.com/shuvo.chakma.16121/"
            target="_blank"
            className="developer"
          >
            -Shuvo(61) ❤️
          </a>
        </p>
        <p>All rights reserved by ECE-23</p>
      </div>
    </>
  );
};
export default App;

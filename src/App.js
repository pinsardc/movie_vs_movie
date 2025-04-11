import { useState, useEffect, useCallback, useMemo } from "react";
import './App.css';
import back_to_the_future from './lib/back_to_the_future.png'
import jaws from './lib/jaws.png'
import mystery from './lib/mystery.png'
import Webcam from "react-webcam";
import { runDetector } from "./js/detector";
import "@tensorflow/tfjs";

const inputResolution = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const videoConstraints = {
  width: inputResolution.width,
  height: inputResolution.height,
  facingMode: "user",
};

const poster_width = '50px';
const poster_height = '75px';

function svg(coord1, coord2, height) {
  return (
    <svg width="120" height={height} xmlns="http://www.w3.org/2000/svg">
      <polyline fill="none" stroke="black" points={coord1} />
      <polyline fill="none" stroke="black" points={coord2} />
    </svg>
  )
}

function App() {
  const [leftForehead, setleftForehead] = useState({x: 1000, y: 1000, z: 0, name: ''});
  const [rightForehead, setrightForehead] = useState({x: 1000, y: 1000, z: 0, name: ''});

  const [loaded, setLoaded] = useState(false);
  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    runDetector(video, setleftForehead, setrightForehead); //running detection on video
    setLoaded(true);
  };

  const [counter, setCounter] = useState(0);
  const [block, setBlock] = useState(0);

  const usableMovies = useMemo(() => { return [
    jaws,
    back_to_the_future,
    jaws,
    back_to_the_future,
    jaws,
    back_to_the_future,
    jaws,
    back_to_the_future,
    back_to_the_future,
    jaws,
    back_to_the_future,
    jaws,
    back_to_the_future,
    jaws,
    back_to_the_future,
    jaws,
  ] }, []);

  const tableScheme = [
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
    mystery,
  ];

  const [tournamentTable, setTournamentTable] = useState(tableScheme);

  const choices = useCallback((index, right/*0 for left 1 for right*/) => {
    if (index < 8) {
      return usableMovies[index * 2 + right];
    }
    return tournamentTable[(index - 8) * 2 + right];
  }, [tournamentTable, usableMovies])

  useEffect(() => {
    if (!!Math.round(leftForehead['y'] < rightForehead['y'] - 75) && block === 0 && counter < 15) {
      setTournamentTable(tournamentTable.map((el, index) => index === counter ? choices(counter, 1) : el));
      setBlock(1);
      setCounter(counter + 1);
      setTimeout(() => {
        setBlock(0);
      }, 1000);
    }
    else if (!!Math.round(leftForehead['y'] > rightForehead['y'] + 75) && block === 0 && counter < 15) {
      setTournamentTable(tournamentTable.map((el, index) => index === counter ? choices(counter, 0) : el));
      setBlock(1);
      setCounter(counter + 1);
      setTimeout(() => {
        setBlock(0);
      }, 1000);
    }
    if (counter === 15) {
      document.getElementById("winner-image").style.display = "initial";
      setCounter(counter + 1);
    }
  }, [leftForehead, rightForehead, block, counter, tournamentTable, choices]);

  function duo(img1, img2, margin) {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <img src={tournamentTable[img1]} alt="logo" style={{width: poster_width, height: poster_height, marginBottom: margin}} />
        <img src={tournamentTable[img2]} alt="logo" style={{width: poster_width, height: poster_height, marginTop: margin}} />
      </div>
    )
  }

  function reset() {
    setCounter(0);
    setBlock(0);
    document.getElementById("winner-image").style.display = "none";
    setTournamentTable(tableScheme);
  }

  return (
    <div className="App">
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <Webcam 
          width={inputResolution.width}
          height={inputResolution.height}
          mirrored={true}
          videoConstraints={videoConstraints}
          onLoadedData={handleVideoLoad} //here we pass in the function
        />
        {(counter < 15) && <img src={choices(counter, 0)} alt="logo" style={{position: 'absolute', left: (inputResolution.width / 2) - Math.round(leftForehead['x']) + 638//238
          , top: Math.round(leftForehead['y']) - 175, width: '150px', height: '225px'}} />}
        {(counter < 15) && <img src={choices(counter, 1)} alt="logo" style={{position: 'absolute', left: inputResolution.width / 2 - Math.round(rightForehead['x']) + 725//238
          , top: Math.round(rightForehead['y']) - 175, width: '150px', height: '225px'}} />}
      </div>

      <img src={tournamentTable[14]} className={"winner-image animLeft"} id="winner-image" alt="logo" style={{display: 'none', width: window.innerWidth / 5, height: window.innerHeight / 2, marginBottom: '35px'}} />

      <header className={"App-header"} style={{top: inputResolution.height * 0.57}}>
        <div className="tree-container" style={{display: 'flex'}}>
          <div className="four-competitors">
            <div className="img-line">
              {duo(0, 1, 0)}
              {svg("0,35 60,35 60,75 1000,75", "0,110 60,110 60,75 1000,75", 120)}
            </div>
            <div className="img-line">
              {duo(2, 3, 0)}
              {svg("0,35 60,35 60,75 1000,75", "0,110 60,110 60,75 1000,75", 120)}
            </div>
          </div>
          <div className="img-line" style={{alignItems: 'center'}}>
              {duo(8, 9, "35px")}
              {svg("0,0 60,0 60,75 1000,75", "0,150 60,150 60,75 1000,75", 150)}
            </div>
          <div className="last-competitor">
            <img src={tournamentTable[12]} alt="logo" style={{width: poster_width, height: poster_height}} />
            <svg width="60" height="150" xmlns="http://www.w3.org/2000/svg">
              <polyline fill="none" stroke="black" points="0,75 60,75" />
            </svg>
          </div>

          <div className="winner">
            <img src={tournamentTable[14]} alt="logo" style={{width: poster_width, height: poster_height}} />
          </div>

          <div className="last-competitor">
            <svg width="60" height="150" xmlns="http://www.w3.org/2000/svg">
              <polyline fill="none" stroke="black" points="0,75 60,75" />
            </svg>
            <img src={tournamentTable[13]} alt="logo" style={{width: poster_width, height: poster_height}} />
          </div>
          <div className="img-line" style={{alignItems: 'center'}}>
            {svg("0,75 60,75 60,0 1000,0", "0,75 60,75 60,150 1000,150", 150)}
            {duo(10, 11, "35px")}
          </div>
          <div className="four-competitors">
            <div className="img-line">
              {svg("0,75 60,75 60,35 1000,35", "0,75 60,75 60,110 1000,110", 120)}
              {duo(4, 5, 0)}
            </div>
            <div className="img-line">
              {svg("0,75 60,75 60,35 1000,35", "0,75 60,75 60,110 1000,110", 120)}
              {duo(6, 7, 0)}
            </div>
          </div>
        </div>
        <button onClick={reset}>RESET</button>
      </header>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedin: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

function App() {
  const [state, setState] = useState(initialState);
  const [init, setInit] = useState(false);

  //Replace componentDidMount with useEffect
  // useEffect(() => {
  //   fetch("http://localhost:3000/")
  //     .then((response) => response.json())
  //     .then(console.log)
  //     .catch((error) => console.error("Error fetching data:", error));
  // }, []); // Empty dependency array ensures it runs once, similar to componentDidMount

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const calculateFaceLocations = (data) => {
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(data);
    const regions = data.outputs[0].data.regions;
    console.log(regions);
    const boundingBoxes = regions.map((region) => {
      const boundingBox = region.region_info.bounding_box;
      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - boundingBox.right_col * width,
        bottomRow: height - boundingBox.bottom_row * height,
      };
    });
    return boundingBoxes;
  };

  const displayFaceBoxes = (boxes) => {
    setState((prevState) => ({
      ...prevState,
      boxes: boxes,
    }));
  };

  const onInputChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      input: event.target.value,
    }));
  };

  const onButtonSubmit = () => {
    setState((prevState) => ({
      ...prevState,
      imageUrl: prevState.input,
    }));

    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: state.input,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Clarifai response");
        }
        return response.json(); // Parse the response from the server
      })
      .then((data) => {
        const faceBoxes = calculateFaceLocations(data);
        displayFaceBoxes(faceBoxes);

        // Update user entries
        return fetch("http://localhost:3000/image", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: state.user.id,
          }),
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update entries");
        }
        return response.json();
      })
      .then((count) => {
        setState((prevState) => ({
          ...prevState,
          user: { ...prevState.user, entries: count },
        }));
      })
      .catch((error) => console.error("Error:", error));
  };

  const particlesOptions = {
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: false,
        speed: 6,
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 80,
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setState(initialState);
    } else if (route === "home") {
      setState((prevState) => ({
        ...prevState,
        isSignedin: true,
      }));
    }
    setState((prevState) => ({
      ...prevState,
      route: route,
    }));
  };

  const loadUser = (data) => {
    setState((prevState) => ({
      ...prevState,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    }));
  };

  return (
    <div className="App">
      {init && <Particles id="tsparticles" options={particlesOptions} />}
      <Navigation isSignedIn={state.isSignedin} onRouteChange={onRouteChange} />

      {state.route === "home" ? (
        <div>
          <Logo />
          <Rank userName={state.user.name} entries={state.user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition boxes={state.boxes} imageUrl={state.imageUrl} />
        </div>
      ) : state.route === "signin" ? (
        <div>
          <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
        </div>
      ) : (
        <div>
          <Register loadUser={loadUser} onRouteChange={onRouteChange} />
        </div>
      )}
    </div>
  );
}

export default App;

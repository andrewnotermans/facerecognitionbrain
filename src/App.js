import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import Clarifai from 'clarifai';
import { loadSlim } from "@tsparticles/slim";
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLikForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';


const app = new Clarifai.App({
 apiKey: '9f5e4bb5c26840a5b7440166b350d24b'
});

function App() {
  const [init, setInit] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
      initParticlesEngine(async (engine) => {
          await loadSlim(engine);
      }).then(() => {
          setInit(true);
      });
  }, []);

  const onInputChange = (event) => {
    console.log(event.target.value);
    setInput(event.target.value);
  }

  const onButtonSubmit = () => {
    console.log('click');
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // In this section, we set the user authentication, user and app ID, model details, and the URL
    // of the image we want as an input. Change these strings to run your own example.
    //////////////////////////////////////////////////////////////////////////////////////////////////

    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = '60df1f2fc09b470da2117dde445f6abf';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'af8w21gvcx87';       
    const APP_ID = 'test';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'general-image-recognition-workflow-jkdxo4' ;
    //const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';    
    const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    
    
  }
  const particlesLoaded = (container) => {
      console.log(container);
  };
  
  return (
    <div className="App">
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
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
          }}
        />
      )}
      <Navigation />
      <Logo />
      <Rank />
      <ImageLikForm 
        onInputChange={onInputChange} 
        onButtonSubmit = {onButtonSubmit} />
    </div>
  );
}

export default App;

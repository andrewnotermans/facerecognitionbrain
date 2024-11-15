import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

function App() {
    const [init, setInit] = useState(false);
    const [input, setInput] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);
    const MODEL_ID = 'face-detection';  
    const returnClarifaiRequestOptions = (imageUrl) => {
        // Your PAT (Personal Access Token) can be found in the Account's Security section
        const PAT = '60df1f2fc09b470da2117dde445f6abf';
        // Specify the correct user_id/app_id pairings
        // Since you're making inferences outside your app's scope
        const USER_ID = 'af8w21gvcx87';       
        const APP_ID = 'image-recognition';
        // Change these to whatever model and image URL you want to use
          
        const IMAGE_URL = imageUrl;

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
        return requestOptions

    }

    
    const onInputChange = (event) => {
        setInput(event.target.value);
    };

    const onButtonSubmit = () => {
        setImageUrl(input);
        console.log({imageUrl});
        fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, returnClarifaiRequestOptions(input))
        .then(console.log(response => response.outputs[0].data.regions))
        .then(response => response.json())
        .then(data => {
            console.log(data.outputs[0].data.regions[0].region_info.bounding_box); // Log the regions data
            return data;
        })
            
        
        .then(result => console.log(result))
        .catch(error => console.error('Error:', error));
 
    }

    const particlesLoaded = (container) => {
        console.log(container);
    }

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
    }

    return (
        <div className="App">
            {init && (
                <Particles
                    id="tsparticles"
                    particlesLoaded={particlesLoaded}
                    options={particlesOptions}
                />
            )}
            <Navigation />
            <Logo />
            <Rank />
            <ImageLinkForm 
                onInputChange={onInputChange} 
                onButtonSubmit={onButtonSubmit} 
            />
            <FaceRecognition imageUrl = {imageUrl}/>
        </div>
    );
}

export default App;

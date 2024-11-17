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
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const MODEL_ID = 'face-detection';  
    const returnClarifaiRequestOptions = (imageUrl) => {
        const PAT = '60df1f2fc09b470da2117dde445f6abf';
        const USER_ID = 'af8w21gvcx87';       
        const APP_ID = 'image-recognition';

        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": imageUrl
                        }
                    }
                }
            ]
        });
        return {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
            },
            body: raw
        };
    };

    const calculateFaceLocations = (data) => {
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);

        const regions = data.outputs[0].data.regions;
        const boundingBoxes = regions.map(region => {
            const boundingBox = region.region_info.bounding_box;
            return {
                leftCol: boundingBox.left_col * width,
                topRow: boundingBox.top_row * height,
                rightCol: width - (boundingBox.right_col * width),
                bottomRow: height - (boundingBox.bottom_row * height),
            };
        });
        return boundingBoxes;
    };

    const displayFaceBoxes = (boxes) => {
        setBoxes(boxes);
        console.log(boxes);
    };

    const onInputChange = (event) => {
        setInput(event.target.value);
    };

    const onButtonSubmit = () => {
        setImageUrl(input);
        fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, returnClarifaiRequestOptions(input))
            .then(response => response.json())
            .then(data => displayFaceBoxes(calculateFaceLocations(data)))
            .catch(error => console.error('Error:', error));
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

    return (
        <div className="App">
            {init && (
                <Particles
                    id="tsparticles"
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
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
    );
}

export default App;

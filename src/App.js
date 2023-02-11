
import * as tf from "@tensorflow/tfjs";
import Webcam from 'react-webcam';
import * as model from "@tensorflow-models/coco-ssd";
import { useRef, useEffect} from 'react';


// works best with these ratios
const height = 640;
const width = 480;




function App() {
const webcamRef = useRef(null);
const canvasRef = useRef(null);


const DetectBound = async () => {
  const net = await model.load();
  canvasRef.current.width = width;
  canvasRef.current.height = height;
  webcamRef.current.video.width = width;
  webcamRef.current.video.height = height;
  
  setInterval( async () => {
    try {
    const video = webcamRef.current.video;
    const detected = await net.detect(video);
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    
    detected.forEach( (DetectedObject) => {
      const [x,y,width,height] = DetectedObject["bbox"];
      ctx.beginPath();
      ctx.fillText(DetectedObject["class"], x, y);
      ctx.rect(x,y,width,height);
      ctx.stroke();
    })
    } catch (e) {
      // console.log(e);
    }
  }, 1)
}

const videoConstraints = {
  width: width,
  height: height,
  facingMode: "user"
};

 

  

useEffect(() => {
  DetectBound()
});
  return (
    <div
    style = {{display: 'flex',  
    justifyContent:'center', 
    alignItems:'center', 
    height: '100vh'}}>

   <Webcam
        audio={false}
        height={height}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={width}
        videoConstraints={videoConstraints}
        style={{
          position: "absolute",
          width: width,
          height: height,
        }}
      />

  <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            width: width,
            height: height,
          }}
        />
    </div>
  );
}

export default App;

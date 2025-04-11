import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

export const runDetector = async (video, setreplacedarea, setrightForehead) => {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: "tfjs",
  };
  const detector = await faceLandmarksDetection.createDetector(
    model,
    detectorConfig
  );
  const detect = async (net) => {
    const estimationConfig = { flipHorizontal: false };
    const faces = await net.estimateFaces(video, estimationConfig);
    if (faces[0]) {
      setreplacedarea(faces[0].keypoints[332]);
      setrightForehead(faces[0].keypoints[103]);
    }
    detect(detector); //rerun the detect function after estimating 
  };
  detect(detector);
};
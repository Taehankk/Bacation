import { useEffect, useRef, useState } from 'react';
import * as tmPose from '@teachablemachine/pose';
import { UserVideoComponent } from '../userVideoComponent';
import { StreamManager } from 'openvidu-browser';
import useViduStore from '../../../store/useViduStore';

interface Props {
  streamManager?: StreamManager;
  userName: string;
}

interface Keypoint {
  score: number;
  part: string;
  position: {
    x: number;
    y: number;
  };
}

interface Pose {
  keypoints: Keypoint[];
}

export const TeachableMotion = ({ streamManager, userName }: Props) => {
  const [model, setModel] = useState<tmPose.CustomPoseNet>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setDetectValue = useViduStore((state) => state.setDetectValue);

  useEffect(() => {
    const initTeachableMachine = async () => {
      const modelURL = '../../my_model/model.json';
      const metadataURL = '../../my_model/metadata.json';

      const model = await tmPose.load(modelURL, metadataURL);
      setModel(model);

      window.requestAnimationFrame(loop);
    };

    initTeachableMachine();
  }, []);

  const loop = async () => {
    await predict();
    window.requestAnimationFrame(loop);
  };

  useEffect(() => {
    if (model && streamManager) {
      window.requestAnimationFrame(loop);
    }
  }, [model, streamManager]);

  const predict = async () => {
    if (!model || !canvasRef.current || !streamManager) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const video = document.querySelector('video') as HTMLVideoElement;
    ctx.drawImage(
      video,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );

    const { pose, posenetOutput } = await model.estimatePose(canvasRef.current);
    const prediction = await model.predict(posenetOutput);
    setDetectValue(Number(prediction[1].probability.toFixed(2)) * 100);

    drawPose(pose, ctx);
  };

  const drawPose = (pose: Pose, ctx: CanvasRenderingContext2D) => {
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  };

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} hidden>
        {streamManager !== undefined && userName && (
          <UserVideoComponent streamManager={streamManager} />
        )}
      </canvas>
    </div>
  );
};

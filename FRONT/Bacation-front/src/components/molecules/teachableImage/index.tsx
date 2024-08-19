import * as tmImage from '@teachablemachine/image';

import { useEffect, useState, useRef } from 'react';

import { UserVideoComponent } from '../userVideoComponent';
import { StreamManager } from 'openvidu-browser';
import useViduStore from '../../../store/useViduStore';

interface Props {
  streamManager?: StreamManager;
  userName: string;
  mode: string;
}

export const TeachableImage = ({ streamManager, userName, mode }: Props) => {
  const [model, setModel] = useState<tmImage.CustomMobileNet>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setDetectValue = useViduStore((state) => state.setDetectValue);

  useEffect(() => {
    const init = async () => {
      try {
        const modelURL =
          mode === 'day'
            ? '../../my_image/model.json'
            : '../../my_flip/model.json';
        const metadataURL =
          mode === 'day'
            ? '../../my_image/metadata.json'
            : '../../my_flip/metadata.json';

        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);

        window.requestAnimationFrame(loop);
      } catch (error) {
        console.error('Error during model initialization:', error);
      }
    };

    init();
  });

  const loop = async () => {
    if (model && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        const videoElement = document.querySelector(
          'video',
        ) as HTMLVideoElement;
        ctx.drawImage(
          videoElement,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
        await predict();
        window.requestAnimationFrame(loop);
      }
    }
  };

  const predict = async () => {
    if (model && canvasRef.current) {
      const prediction = await model.predict(canvasRef.current);

      setDetectValue(Number(prediction[1].probability.toFixed(2)) * 100);
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

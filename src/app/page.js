// components/HandLandmarker.tsx
"use client";
import { useEffect, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export default function HandLandmarkerComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let handLandmarker;

    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          videoRef.current.onloadeddata = () => {
            requestAnimationFrame(predictFrame);
          };
        }
      }
    };

    const predictFrame = async () => {
      if (
        handLandmarker &&
        videoRef.current &&
        canvasRef.current &&
        videoRef.current.readyState === 4
      ) {
        const results = handLandmarker.detectForVideo(
          videoRef.current,
          Date.now()
        );
        const canvasCtx = canvasRef.current.getContext("2d");
        if (!canvasCtx) return;

        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        canvasCtx.drawImage(videoRef.current, 0, 0);

        for (const hand of results.landmarks || []) {
          for (const point of hand) {
            canvasCtx.beginPath();
            canvasCtx.arc(
              point.x * canvasRef.current.width,
              point.y * canvasRef.current.height,
              5,
              0,
              2 * Math.PI
            );
            canvasCtx.fillStyle = "red";
            canvasCtx.fill();
          }
        }
      }

      requestAnimationFrame(predictFrame);
    };

    init();
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}

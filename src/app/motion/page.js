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
          video: { facingMode: { ideal: "environment" } },
          audio: false,
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

        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;

        canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        canvasCtx.drawImage(videoRef.current, 0, 0);

        // 고양이 영역 (픽셀 좌표)
        const xMin = 248.1916;
        const xMax = 478.7289;
        const yMin = 443.2561;
        const yMax = 641.1315;

        for (const hand of results.landmarks || []) {
          let insideCount = 0;

          for (const point of hand) {
            const px = point.x * canvasWidth;
            const py = point.y * canvasHeight;

            // 화면에 점 그리기
            canvasCtx.beginPath();
            canvasCtx.arc(px, py, 5, 0, 2 * Math.PI);
            canvasCtx.fillStyle = "red";
            canvasCtx.fill();

            // 고양이 박스 안에 있는지 체크
            if (px >= xMin && px <= xMax && py >= yMin && py <= yMax) {
              insideCount++;
            }
          }
          if (insideCount > 0) {
            console.log("aaaa");
            window.alert("cat");
          }
        }
      }

      requestAnimationFrame(predictFrame);
    };

    init();
  }, []);

  return (
    <div className="h-full w-full">
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}

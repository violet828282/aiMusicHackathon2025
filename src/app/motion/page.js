"use client";
import { useEffect, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useRouter } from "next/navigation";
export default function HandLandmarkerComponent() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, []);

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
        canvasCtx.drawImage(videoRef.current, 0, 0, canvasWidth, canvasHeight);

        // ✅ 하드코딩된 고양이 좌표
        const xMin = 328.683;
        const yMin = 586.685;
        const xMax = 632.44;
        const yMax = 848.969;

        for (const hand of results.landmarks || []) {
          let insideCount = 0;

          for (const point of hand) {
            const px = point.x * canvasWidth;
            const py = point.y * canvasHeight;

            canvasCtx.beginPath();
            canvasCtx.arc(px, py, 5, 0, 2 * Math.PI);
            canvasCtx.fillStyle = "red";
            canvasCtx.fill();

            if (px >= xMin && px <= xMax && py >= yMin && py <= yMax) {
              insideCount++;
            }
          }

          if (insideCount > 0 && audioRef.current) {
            audioRef.current.play().catch((err) => {
              console.warn("Audio play blocked:", err);
            });
          }
        }
      }

      requestAnimationFrame(predictFrame);
    };

    init();
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const handleCapture = () => {
    window.close()
  };

  return (
    <div className="relative w-full h-screen bg-[url('/mockup_02-a.png')] bg-cover bg-center">
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-19/40 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[340px] object-cover rounded-2xl shadow-2xl"
        style={{
          width:620, height:300,
          display: "block",
        }}
      />
      <audio ref={audioRef} src="/third.mp3" preload="auto" />
      <button
        onClick={handleCapture}
        className="absolute top-[10px] right-[10px] z-50 flex justify-center items-center w-[100px] h-[100px]
        ">
        <img src="/aa.png" alt="카메라 버튼" />
      </button>
    </div>
  );
}

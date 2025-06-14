"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CameraPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // 브라우저에서 카메라 접근 요청
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } }, // 후면 카메라
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("카메라 접근 실패:", err);
      }
    };

    enableCamera();
  }, []);

  const handleCapture = () => {
    // const video = videoRef.current;
    // const canvas = canvasRef.current;

    // if (!video || !canvas) return;

    // canvas.width = video.videoWidth;
    // canvas.height = video.videoHeight;

    // const ctx = canvas.getContext("2d");
    // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 캡처는 필요하지만 저장 안 하고 바로 이동
    // const dataURL = canvas.toDataURL("image/png");

    router.replace("/motion");
    // window.open("https://2025aihackathon.vercel.app/motion");
  };

  return (
    <div className="relative w-full h-screen bg-[url('/mockup_02-b.png')] bg-cover bg-center">
      <video
        ref={videoRef}
        className="absolute top-1/2 left-19/40 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[300px] object-cover rounded-2xl shadow-2xl"
        autoPlay
        playsInline
        muted
      />
      <button
        onClick={handleCapture}
        className="absolute bottom-[140px] right-2 z-50 flex justify-center items-center w-[130px] h-[100px]">
        <img src="/camera_active.png" alt="카메라 버튼" />
      </button>
    </div>
  );
}

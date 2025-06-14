"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // 이미지가 선택되면 자동 업로드
  useEffect(() => {
    if (!file) return;

    const upload = async () => {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/proxy", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
      router.push("/motion");
    };

    upload();
  }, [file]); // file이 바뀔 때마다 실행

  return (
    <main className="h-full w-full bg-[#CCD3D1]">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: "url('/mockup_02-a.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <input
          id="hidden-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          // className="fixed bottom-0 w-full h-[120px]"
          style={{ display: "none" }}
        />
        <label
          htmlFor="hidden-file"
          className="fixed bottom-0 w-full h-[120px]  cursor-pointer"
        />
        {/* {preview && <img src={preview} alt="preview" width={300} />} */}
      </div>
    </main>
  );
}

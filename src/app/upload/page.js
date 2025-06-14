"use client";
import { useState, useEffect } from "react";

export default function Home() {
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
    };

    upload();
  }, [file]); // file이 바뀔 때마다 실행

  return (
    <main>
      <h1>AI 예측 테스트</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" width={300} />}
      {result && (
        <>
          <h2>결과</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </>
      )}
    </main>
  );
}

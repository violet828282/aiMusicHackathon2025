"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CameraPage() {
  return (
    <main className="h-full w-full bg-[#CCD3D1] flex justify-center">
      <div className="py-4 flex flex-col  items-center">
        <img
          src="/logo_highres.png"
          alt="카메라 버튼"
          width={200}
          height={200}
        />
        <div className="flex justify-center flex-col items-start gap-8 pt-10">
          <button class="bg-[#469072] text-black px-6 py-3 rounded-full font-handwritten text-xl border-4 border-black">
            Cats are cute. かわい！！
          </button>
          <button class="bg-[#EAD570] text-black px-6 py-3 rounded-full font-handwritten text-xl border-4 border-black">
            Bird Set Free。　トリトリ
          </button>
          <button class="bg-[#EAD570] text-black px-6 py-3 rounded-full font-handwritten text-xl border-4 border-black">
            Cats will save the world.
          </button>
        </div>
      </div>
    </main>
  );
}

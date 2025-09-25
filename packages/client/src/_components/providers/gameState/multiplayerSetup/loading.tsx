import Image from "next/image";
import loading from "@/../public/loading.webp";

export default function Loading() {
  return (
    <div className="w-full h-full bg-white flex justify-center items-center">
      <div className="flex flex-col justify-center items-center ">
        <Image src={loading} alt="loading" />
        <h1 className="text-neutral-600 text-lg font-bold text-center">
          Server might take 30-60 seconds to spin up
          <br />
          (Im <span className="line-through font-normal">broke</span> on the
          free plan)
        </h1>
      </div>
    </div>
  );
}

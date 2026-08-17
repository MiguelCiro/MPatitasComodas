"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type Props = {
  image: string;
  name: string;
};

export default function ProductGallery({
  image,
  name,
}: Props) {

  const [currentImage, setCurrentImage] = useState(image);

  useEffect(() => {
    setCurrentImage(image);
  }, [image]);

  return (
    <div className="relative flex items-center justify-center bg-[#f7f7f7] h-[45vh] lg:h-full">
      <div className="relative w-full h-full p-8 sm:p-12 lg:p-16">
        <Image
          src={currentImage}
          alt={name}
          fill
          priority
          sizes="50vw"
          className="object-contain transition duration-300 hover:scale-105"
        />

      </div>

    </div>
  );
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Eye } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import ImageModal from "./ImageModal ";

export function BentoGridGallery() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios
      .get("/api/menus")
      .then(({ data }) => {
        console.log("Fetched menu data:", data);
        setMenus(data);
      })
      .catch((err) => {
        console.error("Error fetching menu data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-10">Loading menus...</p>;

  return (
    <>
      <BentoGrid className="max-w-7xl mx-auto">
        {menus.map((item, i) => (
          <BentoGridItem
            key={i}
            className={`${i === 3 || i === 6 ? "md:col-span-2" : ""} h-64`}
            header={
              <div className="cursor-pointer">
                <Skeleton image={item.image} onEyeClick={() => setSelectedImage(item.image)} />
              </div>
            }
          />
        ))}
      </BentoGrid>

      {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  );
}

const Skeleton = ({ image, onEyeClick }) => {
  const [src, setSrc] = useState(image);

  return (
    <div className="relative w-full h-[260px] max-sm:h-60 rounded-xl overflow-hidden group">
      <Image
        src={src}
        alt="Menu"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover rounded-xl"
        onError={() => setSrc("/fallback.jpg")}
      />

      {/* Hover overlay with animated slide from top */}
      <div className="absolute inset-0 transform -translate-y-full group-hover:translate-y-0 transition-all duration-500 bg-black/40 z-20 flex flex-col items-center justify-center">
        <div
          className="border-2 p-2 rounded-full cursor-pointer hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent clicks
            onEyeClick();
          }}
        >
          <Eye className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );
};
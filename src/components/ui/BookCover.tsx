import Image from "next/image";

interface Props {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function BookCover({ size = "medium", className = "" }: Props) {
  const dimensions = {
    small: { width: 180, height: 270 },
    medium: { width: 240, height: 360 },
    large: { width: 320, height: 480 },
  };

  const { width, height } = dimensions[size];

  return (
    <div className={`book-cover book-cover--${size} ${className}`}>
      <Image
        src="/cover.jpg"
        alt="Couverture - Des anges sur mon chemin"
        width={width}
        height={height}
        style={{ 
          objectFit: "cover",
          borderRadius: "6px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)",
          display: "block"
        }}
        priority
      />
    </div>
  );
}

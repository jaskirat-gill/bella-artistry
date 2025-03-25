import React from "react";

interface PortfolioImageRotatorProps {
  portfolio: { sourceUrl: string }[];
  intervalMs?: number; // duration each image is displayed, default 3000ms
}

export default function PortfolioImageRotator({
  portfolio,
  intervalMs = 10000,
}: PortfolioImageRotatorProps) {
  const totalDuration = intervalMs * portfolio.length;

  return (
    <div className="relative order-1 md:order-2 h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl">
      {portfolio.map((item, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center w-full h-full"
          style={{
            backgroundImage: `url(${item.sourceUrl})`,
            // Apply the keyframe animation with delay per image
            animation: `fade ${totalDuration}ms infinite`,
            animationDelay: `${index * intervalMs}ms`,
          }}
        ></div>
      ))}
      <style jsx>{`
        @keyframes fade {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          33.33% {
            opacity: 1;
          }
          43.33% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

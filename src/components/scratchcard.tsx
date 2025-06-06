import React from 'react';

export const ScratchCard = ({
  width,
  height,
  image,
  children,
}: {
  width: number;
  height: number;
  image: string;
  finishPercent: number;
  onComplete: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div style={{ width, height, backgroundImage: `url(${image})` }}>
      {children}
    </div>
  );
};

export const ScratchCardWrapper = () => {
  return (
    <div>
      <ScratchCard
        width={300}
        height={300}
        image="../zdrapa.jpg"
        finishPercent={50}
        onComplete={() => console.log("Card scratched")}
      >
        <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
          Your content here
        </div>
      </ScratchCard>
    </div>
  );
};
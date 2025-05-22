import React from 'react';

export const Scratchcard = ({ width, height, image, finishPercent, onComplete, children }) => {
  return (
    <div style={{ width, height }}>
      {children}
    </div>
  );
};

export const ScratchCardWrapper = () => {
  return (
    <div>
      <Scratchcard
        width={300}
        height={300}
        image="path/to/cover-image.jpg"
        finishPercent={50}
        onComplete={() => console.log("Card scratched")}
      >
        <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
          Your content here
        </div>
      </Scratchcard>
    </div>
  );
};
# Scratch Cards

A simple scratch card implementation using React, TypeScript, and Vite.

## Features

- Interactive scratch card functionality
- Customizable card designs
- Reveal hidden content with mouse/touch gestures

## Getting Started

1. Clone the repository
2. Install dependencies:
```shell
npm install
```

3. Run the development server:
```shell
npm run dev
```

## Usage

Import the ScratchCard component and use it in your React application:

```typescript
import { ScratchCard } from './components/ScratchCard';

function App() {
  return (
    <ScratchCard 
      coverImage="path/to/cover.png"
      hiddenContent="Congratulations!"
    />
  );
}
```

## Configuration

You can customize the scratch card with these props:
- `coverImage`: Image shown before scratching
- `hiddenContent`: Content revealed after scratching
- `brushSize`: Size of the scratch area
- `completion`: Percentage required to fully reveal

## License

MIT License

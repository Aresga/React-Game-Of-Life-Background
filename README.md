# Game of Life Background Component

A React component that renders Conway's Game of Life as an animated background, inspired by the ReactBits design system.

## Installation

```bash
npm install react
```

No additional dependencies required - uses native Canvas API.

## Usage

### Basic Example (Hero Section Background)

```jsx
import GameOfLife from './GameOfLife';

function Hero() {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      {/* Background Layer */}
      <GameOfLife 
        color="#B19EEF"
        speed={200}
        initialDensity={0.3}
        transparent={true}
      />
      
      {/* Content Layer */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <h1 style={{ color: 'white', fontSize: '4rem' }}>
          Welcome to My Site
        </h1>
      </div>
    </div>
  );
}
```

### Full Configuration Example

```jsx
<GameOfLife 
  gridSize={100}              // Grid dimensions (50-150 recommended)
  cellSize={6}                // Visual size of cells (not used in current impl)
  color="#B19EEF"             // Hex color for living cells
  speed={200}                 // Update interval in ms (lower = faster)
  initialDensity={0.3}        // Starting population density (0-1)
  autoStart={true}            // Start animating immediately
  showControls={false}        // Show control panel (not implemented)
  showStats={false}           // Show generation/cell counter
  interactive={false}         // Allow click/drag to add cells
  fadeEdges={true}            // Apply fade effect at edges
  ageBasedColor={true}        // Cells get brighter with age
  transparent={true}          // Transparent background
  className="my-custom-class"
  style={{ width: '100%', height: '100vh' }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gridSize` | number | 100 | Number of cells in grid (width & height) |
| `cellSize` | number | 6 | Display size hint for cells |
| `color` | string | '#B19EEF' | Hex color for living cells |
| `speed` | number | 200 | Milliseconds between generations |
| `initialDensity` | number | 0.3 | Initial alive cell percentage (0-1) |
| `autoStart` | boolean | true | Start animation on mount |
| `showControls` | boolean | false | Display control panel |
| `showStats` | boolean | false | Display generation counter |
| `interactive` | boolean | false | Enable click/drag to draw cells |
| `fadeEdges` | boolean | true | Fade cells near edges |
| `ageBasedColor` | boolean | true | Brighter color for older cells |
| `transparent` | boolean | true | Transparent background |
| `className` | string | '' | Additional CSS class |
| `style` | object | {} | Inline styles |

## Common Use Cases

### 1. Full-Screen Hero Background

```jsx
<div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
  <GameOfLife 
    gridSize={120}
    speed={150}
    color="#667eea"
    transparent={true}
  />
  <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
    {/* Your hero content */}
  </div>
</div>
```

### 2. Section Background (Non-interactive)

```jsx
<section style={{ position: 'relative', padding: '4rem 2rem' }}>
  <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
    <GameOfLife 
      speed={300}
      interactive={false}
      transparent={true}
    />
  </div>
  <div style={{ position: 'relative', zIndex: 1 }}>
    {/* Your content */}
  </div>
</section>
```

### 3. Interactive Demo with Stats

```jsx
<GameOfLife 
  interactive={true}
  showStats={true}
  speed={100}
  initialDensity={0.2}
/>
```

### 4. Slow, Subtle Animation

```jsx
<GameOfLife 
  speed={500}
  initialDensity={0.15}
  color="#10b981"
  fadeEdges={true}
  ageBasedColor={true}
/>
```

## Performance Tips

- **Grid Size**: Larger grids (150+) may impact performance on slower devices. Use 80-100 for hero sections.
- **Speed**: Values below 100ms can be CPU-intensive. 150-300ms is a good balance.
- **Initial Density**: 0.2-0.4 creates interesting patterns without overwhelming the grid.
- **Transparent Background**: Use `transparent={true}` for overlaying content.

## Conway's Game of Life Rules

The component implements the classic rules:
1. Any live cell with 2-3 neighbors survives
2. Any live cell with <2 or >3 neighbors dies
3. Any dead cell with exactly 3 neighbors becomes alive

## Browser Support

Works in all modern browsers with Canvas API support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+



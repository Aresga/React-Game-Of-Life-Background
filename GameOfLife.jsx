import { useEffect, useRef } from 'react';
import './GameOfLife.css';

const GameOfLife = ({
  gridSize = 100,
  cellSize = 6,
  color = '#B19EEF',
  speed = 200,
  initialDensity = 0.3,
  autoStart = true,
  showControls = false,
  showStats = false,
  interactive = false,
  fadeEdges = true,
  ageBasedColor = true,
  transparent = true,
  className,
  style
}) => {
  const canvasRef = useRef(null);
  const gridRef = useRef(null);
  const animationRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const statsRef = useRef({ generation: 0, living: 0 });
  const mouseRef = useRef({ isDrawing: false, lastX: -1, lastY: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize grid
    const createGrid = (fill = false, density = 0) => {
      const grid = Array(gridSize).fill(null).map(() => 
        Array(gridSize).fill(null).map(() => ({
          alive: fill ? Math.random() < density : false,
          age: 0
        }))
      );
      return grid;
    };

    gridRef.current = createGrid(autoStart, initialDensity);
    statsRef.current = { generation: 0, living: countLiving() };

    // Resize canvas
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      render();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Count living cells
    function countLiving() {
      if (!gridRef.current) return 0;
      let count = 0;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (gridRef.current[i][j].alive) count++;
        }
      }
      return count;
    }

    // Count neighbors
    function countNeighbors(x, y) {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newX = (x + i + gridSize) % gridSize;
          const newY = (y + j + gridSize) % gridSize;
          if (gridRef.current[newX][newY].alive) count++;
        }
      }
      return count;
    }

    // Update grid (Game of Life rules)
    function updateGrid() {
      const newGrid = createGrid(false);
      
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const neighbors = countNeighbors(i, j);
          const currentCell = gridRef.current[i][j];
          
          if (currentCell.alive) {
            // Cell survives with 2 or 3 neighbors
            if (neighbors === 2 || neighbors === 3) {
              newGrid[i][j].alive = true;
              newGrid[i][j].age = currentCell.age + 1;
            }
          } else {
            // Dead cell becomes alive with exactly 3 neighbors
            if (neighbors === 3) {
              newGrid[i][j].alive = true;
              newGrid[i][j].age = 0;
            }
          }
        }
      }
      
      gridRef.current = newGrid;
      statsRef.current.generation++;
      statsRef.current.living = countLiving();
    }

    // Render grid
    function render() {
      if (!ctx || !gridRef.current) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      if (transparent) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
      }
      
      // Calculate cell display size
      const cellWidth = width / gridSize;
      const cellHeight = height / gridSize;
      const displaySize = Math.min(cellWidth, cellHeight) * 0.9;
      
      // Parse color
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 177, g: 158, b: 239 };
      };
      
      const rgb = hexToRgb(color);
      
      // Draw cells
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const cell = gridRef.current[i][j];
          if (!cell.alive) continue;
          
          const x = i * cellWidth + (cellWidth - displaySize) / 2;
          const y = j * cellHeight + (cellHeight - displaySize) / 2;
          
          // Calculate opacity based on age
          let opacity = 1;
          if (ageBasedColor) {
            opacity = Math.min(0.4 + cell.age * 0.1, 1);
          }
          
          // Apply edge fade
          if (fadeEdges) {
            const centerX = gridSize / 2;
            const centerY = gridSize / 2;
            const distX = Math.abs(i - centerX) / centerX;
            const distY = Math.abs(j - centerY) / centerY;
            const dist = Math.max(distX, distY);
            const fade = 1 - Math.pow(dist, 2) * 0.5;
            opacity *= Math.max(fade, 0.3);
          }
          
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
          ctx.fillRect(x, y, displaySize, displaySize);
        }
      }
    }

    // Animation loop
    function animate(timestamp) {
      if (timestamp - lastUpdateRef.current >= speed) {
        updateGrid();
        render();
        lastUpdateRef.current = timestamp;
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    // Mouse interaction
    function handlePointerDown(e) {
      if (!interactive) return;
      mouseRef.current.isDrawing = true;
      toggleCell(e);
    }

    function handlePointerMove(e) {
      if (!interactive || !mouseRef.current.isDrawing) return;
      toggleCell(e);
    }

    function handlePointerUp() {
      if (!interactive) return;
      mouseRef.current.isDrawing = false;
      mouseRef.current.lastX = -1;
      mouseRef.current.lastY = -1;
    }

    function toggleCell(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const cellWidth = canvas.width / gridSize;
      const cellHeight = canvas.height / gridSize;
      
      const gridX = Math.floor(x / cellWidth);
      const gridY = Math.floor(y / cellHeight);
      
      if (gridX === mouseRef.current.lastX && gridY === mouseRef.current.lastY) return;
      
      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
        gridRef.current[gridX][gridY].alive = !gridRef.current[gridX][gridY].alive;
        gridRef.current[gridX][gridY].age = 0;
        mouseRef.current.lastX = gridX;
        mouseRef.current.lastY = gridY;
        render();
      }
    }

    if (interactive) {
      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.addEventListener('pointerleave', handlePointerUp);
    }

    // Start animation
    if (autoStart) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      render();
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (interactive) {
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerup', handlePointerUp);
        canvas.removeEventListener('pointerleave', handlePointerUp);
      }
    };
  }, [gridSize, cellSize, color, speed, initialDensity, autoStart, interactive, fadeEdges, ageBasedColor, transparent]);

  return (
    <div 
      className={`game-of-life-container ${className || ''}`}
      style={style}
      aria-label="Game of Life animated background"
    >
      <canvas ref={canvasRef} className="game-of-life-canvas" />
      {showStats && (
        <div className="game-of-life-stats">
          Generation: {statsRef.current.generation} | Living: {statsRef.current.living}
        </div>
      )}
    </div>
  );
};

export default GameOfLife;
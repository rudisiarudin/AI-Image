import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ImageFile } from '../types';

interface DrawingCanvasProps {
  width: number;
  height: number;
  onCanvasExport: (imageFile: ImageFile | null) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ width, height, onCanvasExport }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(5);

  const buttonClasses = (isActive: boolean) =>
    `p-2 rounded-lg border-2 transition-all ${
      isActive ? 'bg-accent-blue border-accent-blue text-background shadow-glow-blue' : 'bg-surface border-border-color hover:border-accent-blue'
    }`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(dpr, dpr);
    context.lineCap = 'round';
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;

    context.fillStyle = '#131314'; // background color
    context.fillRect(0, 0, width, height);
    exportCanvas();
  }, [width, height]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = brushColor;
    }
  }, [brushColor]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  const getCoords = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    const rect = canvas.getBoundingClientRect();

    if (window.TouchEvent && event.nativeEvent instanceof TouchEvent) {
      const touch = event.nativeEvent.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      };
    }
    const mouseEvent = event as React.MouseEvent<HTMLCanvasElement>;
    return {
      offsetX: mouseEvent.nativeEvent.offsetX,
      offsetY: mouseEvent.nativeEvent.offsetY
    };
  };

  const startDrawing = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const { offsetX, offsetY } = getCoords(event);
    if (!contextRef.current) return;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }, []);

  const exportCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (canvas) {
          const dataUrl = canvas.toDataURL('image/png');
          onCanvasExport({ data: dataUrl, mimeType: 'image/png'});
      }
  }, [onCanvasExport]);

  const finishDrawing = useCallback(() => {
    if (!contextRef.current || !isDrawing) return;
    contextRef.current.closePath();
    setIsDrawing(false);
    exportCanvas();
  }, [isDrawing, exportCanvas]);
  
  const draw = useCallback((event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = getCoords(event);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  }, [isDrawing]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.fillStyle = '#131314';
      context.fillRect(0, 0, width, height);
      onCanvasExport(null); // Clear the parent state
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-background rounded-lg border border-border-color">
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        <div className="flex items-center gap-2">
            <span className="text-xs text-secondary-text">Warna:</span>
            <button className={buttonClasses(brushColor === '#FFFFFF')} onClick={() => setBrushColor('#FFFFFF')} title="Kuas Putih">
                <div className="w-5 h-5 bg-white rounded-md"></div>
            </button>
            <button className={buttonClasses(brushColor === '#131314')} onClick={() => setBrushColor('#131314')} title="Penghapus">
                <div className="w-5 h-5 bg-background rounded-md border border-border-color"></div>
            </button>
        </div>
        <div className="flex items-center gap-2 flex-grow min-w-[120px]">
            <span className="text-xs text-secondary-text">Ukuran:</span>
            <input 
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer range-sm"
                style={{
                    background: `linear-gradient(to right, #8ab4f8 ${((brushSize - 1) / 49) * 100}%, #282a2d ${((brushSize - 1) / 49) * 100}%)`
                }}
            />
        </div>
        <button onClick={clearCanvas} className="text-xs bg-error-red-bg hover:bg-error-red/20 text-error-red font-semibold py-1.5 px-3 rounded-md transition self-start border border-error-red/30">
            Bersihkan
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
        className="touch-none rounded-lg border-2 border-border-color bg-background"
      />
    </div>
  );
};

export default DrawingCanvas;
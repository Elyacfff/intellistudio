import React, { useEffect, useRef } from 'react';
import { themes } from '@/hooks/useTheme';
import { useAppStore } from '@/store/appStore';

const DynamicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useAppStore();
  const colors = themes[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.002;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更柔和的动态渐变背景
      const centerX = canvas.width / 2 + Math.sin(time * 0.5) * canvas.width * 0.2;
      const centerY = canvas.height / 2 + Math.cos(time * 0.3) * canvas.height * 0.2;
      
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        canvas.width * 0.8
      );
      
      gradient.addColorStop(0, `${colors.primary}08`);
      gradient.addColorStop(0.3, `${colors.primary}04`);
      gradient.addColorStop(1, `${colors.primary}00`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 补充轻微的第二层光晕
      const centerX2 = canvas.width * 0.3 + Math.cos(time * 0.4) * canvas.width * 0.1;
      const centerY2 = canvas.height * 0.7 + Math.sin(time * 0.6) * canvas.height * 0.1;
      
      const gradient2 = ctx.createRadialGradient(
        centerX2,
        centerY2,
        0,
        centerX2,
        centerY2,
        canvas.width * 0.5
      );
      
      gradient2.addColorStop(0, `${colors.secondary}06`);
      gradient2.addColorStop(1, `${colors.secondary}00`);
      
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme, colors.primary, colors.secondary]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default DynamicBackground;
import { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  type ChartConfiguration,
} from "chart.js";

Chart.register(DoughnutController, ArcElement);

interface MatchScoreGaugeProps {
  score: number;
  label: string;
}

const getLabelColor = (label: string): string => {
  const normalized = label.toLowerCase();

  if (normalized.includes("excellent") || normalized.includes("good")) {
    return "text-green-600";
  }

  if (normalized.includes("fair")) {
    return "text-orange-500";
  }

  return "text-red-500";
};

const MatchScoreGauge = ({ score, label }: MatchScoreGaugeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#f97316");
    gradient.addColorStop(0.5, "#eab308");
    gradient.addColorStop(1, "#22c55e");

    const safeScore = Math.min(100, Math.max(0, score));

    const config: ChartConfiguration<"doughnut"> = {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [safeScore, 100 - safeScore],
            backgroundColor: [gradient, "#e5e7eb"],
            borderWidth: 0,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "78%",
        rotation: -90,
        circumference: 360,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        animation: {
          animateRotate: true,
          duration: 900,
        },
      },
    };

    chartRef.current = new Chart(canvas, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-44 w-44">
        <canvas ref={canvasRef} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-900">{score}%</span>
          <span className="text-xs text-slate-500">Match Score</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-semibold ${getLabelColor(label)}`}>
        {label}
      </span>
    </div>
  );
};

export default MatchScoreGauge;

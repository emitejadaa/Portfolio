import {
  Binary,
  Boxes,
  Braces,
  Brackets,
  Cherry,
  CircuitBoard,
  Code2,
  Database,
  DatabaseZap,
  Figma,
  FlaskConical,
  GitBranch,
  Grid3x3,
  Infinity,
  LayoutPanelLeft,
  LineChart,
  Sparkles,
  SquareCode,
  TerminalSquare,
  Zap,
  type LucideIcon,
} from "lucide-react";

const techIconMap: Record<string, LucideIcon> = {
  Arduino: CircuitBoard,
  Electrónica: Zap,
  C: Braces,
  "C++": Brackets,
  "Raspberry Pi": Cherry,
  Python: Binary,
  TensorFlow: Boxes,
  NumPy: Grid3x3,
  Matplotlib: LineChart,
  "Google Colab": Infinity,
  Flask: FlaskConical,
  JavaScript: Code2,
  SQL: Database,
  Postgres: DatabaseZap,
  "HTML / CSS": LayoutPanelLeft,
  "Git & GitHub": GitBranch,
  Linux: TerminalSquare,
  "VS Code": SquareCode,
  Figma: Figma,
};

/** Devuelve el ícono de lucide asociado a una tecnología, con fallback. */
export function getTechIcon(name: string): LucideIcon {
  return techIconMap[name] ?? Sparkles;
}

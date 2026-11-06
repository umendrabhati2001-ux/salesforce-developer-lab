import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { RoadmapSection } from "@/components/RoadmapSection";
import { VisualizersSection } from "@/components/VisualizersSection";
import { BulkBattleSection } from "@/components/BulkBattleSection";
import { ThreeDPatternMatrixSection } from "@/components/ThreeDPatternMatrixSection";
import { InteractiveApexCliSection } from "@/components/InteractiveApexCliSection";
import { SchemaExplorerSection } from "@/components/SchemaExplorerSection";
import { ExecutionOrderSection } from "@/components/ExecutionOrderSection";
import { CodeArenaSection } from "@/components/CodeArenaSection";
import { InterviewSection } from "@/components/InterviewSection";
import { Footer } from "@/components/Footer";
import { AiMascotCompanion } from "@/components/AiMascotCompanion";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-300 relative">
      <Navbar />
      <HeroSection />
      <RoadmapSection />
      <VisualizersSection />
      <BulkBattleSection />
      <ThreeDPatternMatrixSection />
      <InteractiveApexCliSection />
      <SchemaExplorerSection />
      <ExecutionOrderSection />
      <CodeArenaSection />
      <InterviewSection />
      <Footer />
      {/* Floating 3D AI Mascot Companion */}
      <AiMascotCompanion />
    </main>
  );
}

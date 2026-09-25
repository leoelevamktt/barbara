import {
  UserRound, ShieldCheck, UsersRound, User, BriefcaseBusiness, Scale,
  Leaf, MonitorSmartphone, FileText, Landmark, Siren
} from "lucide-react";
import type { Area } from "@/lib/content";

const icons = { UserRound, ShieldCheck, UsersRound, User, BriefcaseBusiness, Scale, Leaf, MonitorSmartphone, FileText, Landmark, Siren };

export default function AreasGrid({ areas, compact = false }: { areas: Area[]; compact?: boolean }) {
  return (
    <div className={compact ? "areas-grid compact" : "areas-grid"}>
      {areas.map((area) => {
        const Icon = icons[area.icon as keyof typeof icons] || Scale;
        return (
          <article className={`area-card ${area.slug === "execucao-penal" ? "area-card-wide" : ""} ${area.slug === "prisao-em-flagrante" ? "area-card-featured" : ""}`} key={area.slug}>
            <Icon size={compact ? 29 : 34} strokeWidth={1.4} />
            <h3>{area.title}</h3>
            <p>{area.description}</p>
          </article>
        );
      })}
    </div>
  );
}

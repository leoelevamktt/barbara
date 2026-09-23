import type { Metadata } from "next";
import AboutReference from "@/components/AboutReference";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sobre a Advogada",
  description: "Conheça a trajetória, missão, visão e valores da Dra. Bárbara Cordeiro, advogada criminalista em São Paulo."
};

export default async function Sobre() {
  const site = await getSiteContent();
  return <AboutReference site={site} breadcrumb />;
}

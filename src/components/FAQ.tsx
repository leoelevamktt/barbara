import type { Faq } from "@/lib/content";

export default function FAQ({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faq-list">
      {faqs.map((item, index) => (
        <details key={item.q} open={index === 0}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

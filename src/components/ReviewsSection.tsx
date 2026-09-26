import { ArrowUpRight, Quote, Star } from "lucide-react";
import type { SiteContent } from "@/lib/content";

export default function ReviewsSection({ reviews }: { reviews: SiteContent["reviews"] }) {
  if (!reviews?.items?.length) return null;
  const profileUrl = reviews.profileUrl?.startsWith("https://")
    ? reviews.profileUrl
    : undefined;

  return (
    <section className="section google-reviews-section" aria-labelledby="google-reviews-title">
      <div className="shell">
        <div className="reviews-heading">
          <div>
            <span className="reviews-eyebrow">Experiências compartilhadas</span>
            <h2 id="google-reviews-title">Avaliações no Google</h2>
            <p>Depoimentos publicados por pessoas que avaliaram o atendimento no Google.</p>
          </div>
          {profileUrl && (
            <a className="reviews-google-link" href={profileUrl} target="_blank" rel="noopener noreferrer">
              Ver perfil no Google <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          )}
        </div>

        <div className="reviews-grid">
          {reviews.items.map((review) => (
            <figure className="review-card" key={review.id}>
              <div className="review-card-top">
                <div className="review-reviewer">
                  <div className="review-avatar" aria-hidden="true">
                    {review.name.trim().slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <figcaption>{review.name}</figcaption>
                    <span>Publicado no Google</span>
                  </div>
                </div>
                <Quote className="review-quote-icon" size={28} strokeWidth={1.2} aria-hidden="true" />
              </div>
              <div className="review-stars" role="img" aria-label={`${review.rating} de 5 estrelas`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={17} strokeWidth={1.2}
                    fill={i < review.rating ? "currentColor" : "none"} aria-hidden="true" />
                ))}
              </div>
              <blockquote>{review.text}</blockquote>
            </figure>
          ))}
        </div>
        <p className="reviews-source-note">
          Avaliações espontâneas atribuídas a seus autores, conforme publicadas no Google.
          {profileUrl && <>{" "}<a href={profileUrl} target="_blank" rel="noopener noreferrer">Consultar a origem <ArrowUpRight size={13} aria-hidden="true" /></a></>}
        </p>
      </div>
    </section>
  );
}

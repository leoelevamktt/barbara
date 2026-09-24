export default function MapEmbed({ address, tall = false }: { address: string; tall?: boolean }) {
  const directionsQuery = encodeURIComponent(address.replace("—", ","));
  const mapUrl = `https://maps.google.com/maps?q=${directionsQuery}&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${directionsQuery}`;

  return (
    <div className={`map-embed ${tall ? "tall" : ""}`.trim()}>
      <iframe
        src={mapUrl}
        title={`Mapa de ${address}`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <a href={directionsUrl} target="_blank" rel="noreferrer" className="map-open-link">
        Abrir no Google Maps
      </a>
    </div>
  );
}

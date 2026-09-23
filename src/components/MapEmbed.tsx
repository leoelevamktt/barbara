export default function MapEmbed({ address, tall = false }: { address: string; tall?: boolean }) {
  const query = encodeURIComponent(address.replace("—", ","));
  const mapUrl = `https://www.google.com/maps?q=${query}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className={`map-embed ${tall ? "tall" : ""}`.trim()}>
      <iframe
        src={mapUrl}
        title={`Mapa de ${address}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a href={directionsUrl} target="_blank" rel="noreferrer" className="map-open-link">
        Abrir no Google Maps
      </a>
    </div>
  );
}

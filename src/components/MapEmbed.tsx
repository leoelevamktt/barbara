export default function MapEmbed({ address, tall = false }: { address: string; tall?: boolean }) {
  const directionsQuery = encodeURIComponent(address.replace("—", ","));
  const mapUrl = "https://www.openstreetmap.org/export/embed.html?bbox=-46.7248%2C-23.6074%2C-46.6888%2C-23.5874&layer=mapnik&marker=-23.5974%2C-46.7068";
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

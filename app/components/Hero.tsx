export default function Hero() {
  return (
    <div
      id="home"
      className="relative z-10 flex justify-between items-center max-w-7xl mx-auto px-8 pt-20"
    >
      <div className="max-w-2xl">
        <h1 className="text-white text-6xl font-bold leading-tight drop-shadow-lg">
          Sistem Perencanaan <span className="block">Pembangunan</span>{" "}
          <span className="block">Bangunan Hunian</span>{" "}
          <span className="block">Strategis dan Sehat</span>{" "}
          <span className="block">berbasis GIS</span>{" "}
          <span className="block">(SICATHAS)</span>
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl max-w-xl">
        <p className="text-xl mb-6">
          Temukan lokasi hunian ideal dengan SICATHAS – sistem berbasis
          Geographic Information System (GIS) yang membantu Anda merencanakan
          pembangunan hunian yang sehat, strategis, dan berkelanjutan.
        </p>
        <p className="text-xl">
          Dapatkan hunian yang aman, nyaman dengan mudah bersama kami! 🚀
        </p>
      </div>
    </div>
  );
}

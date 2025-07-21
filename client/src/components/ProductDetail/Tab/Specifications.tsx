const specList = `
<li>Mendukung prosesor Intel® Core™ Ultra (Seri 2)</li>
<li>Solusi VRM Digital twin 16+1+2 phases</li>
<li>D5 Bionic Corsa untuk Performa Memori Tanpa Batas</li>
<li>AORUS AI SNATCH: Perangkat Lunak Auto-Overclocking oleh model AI</li>
<li>AI Perfdrive: Menyediakan profil preset BIOS yang optimal dan dapat disesuaikan untuk pengguna</li>
<li>Premium Compatibility: 4 * DDR5 dengan Dukungan Modul Memori XMP</li>
<li>WIFI EZ-Plug: Desain yang cepat dan mudah untuk pemasangan antena Wi-Fi</li>
<li>EZ-Latch Plus: Slot PCIe dan M.2 dengan Desain Quick Release & Screwless</li>
<li>EZ-Latch Click: Heatsink M.2 dengan desain Screwless (tanpa sekrup)</li>
<li>Sensor Panel Link: Port video onboard untuk pengaturan panel dalam chassis yang tidak merepotkan</li>
<li>Friendly UI: Multi-Tema, Kontrol Kipas AIO, dan Pemindaian Otomatis Q-Flash di BIOS dan SW</li>
<li>Power Monitor Baru di HWinfo untuk pemantauan real-time pada fase daya CPU</li>
<li>Ultra-Fast Storage: 5 * slot M.2, termasuk 1 * PCIe 5.0 x4</li>
<li>Efficient Thermal: VRM Thermal Armor Advanced & M.2 Thermal Guard L</li>
<li>Fast Networking: LAN 2.5GbE & Wi-Fi 7 dengan directional Ultra-high gain antenna</li>
<li>Extended Connectivity:THUNDERBOLT™ 4 Tipe-C dengan DP-Alt</li>
<li>High-Res Audio: Kapasitor Kelas Audiophile ALC1220 & WIMA</li>
<li>Ultra Durable PCIe Armor: Pelat belakang logam slot PCIe x16 untuk meningkatkan daya tahan</li>
<li>PCIe UD Slot X: Slot PCIe 5.0 x16 dengan kekuatan 10X untuk kartu grafis</li>
`;

export default function Specifications() {
  // Ambil isi dari <li> dan jadikan array string
  const items = Array.from(specList.matchAll(/<li>(.*?)<\/li>/g), (m) => m[1]);
  return (
    <div className="py-4">
      <h1 className="font-bold text-2xl pb-4">
        Gigabyte Motherboard Intel Z890 Aorus Elite X Ice
      </h1>
      {
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      }
    </div>
  );
}

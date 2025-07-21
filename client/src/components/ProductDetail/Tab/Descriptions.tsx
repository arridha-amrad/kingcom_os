const description = `
 Motherboard ini dirancang untuk mendukung prosesor Intel® Core™ Ultra (Seri 2), menghadirkan performa canggih dengan solusi VRM 16+1+2 fase berbasis digital twin untuk kestabilan daya yang optimal. Dilengkapi dengan D5 Bionic Corsa, sistem ini memungkinkan performa memori yang luar biasa dan tak terbatas, didukung oleh kompatibilitas memori DDR5 dengan dukungan modul XMP.

  Mengusung kecanggihan AI, fitur AORUS AI SNATCH menghadirkan teknologi auto-overclocking berbasis model kecerdasan buatan, sementara AI Perfdrive menyediakan profil BIOS yang optimal dan personal bagi pengguna. Instalasi juga dipermudah dengan fitur WIFI EZ-Plug untuk pemasangan antena Wi-Fi yang cepat dan sederhana.

  Untuk kemudahan dalam perakitan, tersedia teknologi EZ-Latch Plus yang memungkinkan pelepasan cepat dan desain tanpa sekrup pada slot PCIe dan M.2, serta EZ-Latch Click pada heatsink M.2 yang juga menggunakan sistem tanpa sekrup. Pengguna juga dimanjakan dengan Sensor Panel Link, port video onboard yang memudahkan pemasangan panel dalam casing.

  Antarmuka BIOS dan perangkat lunak hadir dengan tampilan ramah pengguna yang mendukung banyak tema, kontrol kipas AIO, serta fitur Q-Flash Auto Scan. Pemantauan performa sistem juga semakin akurat berkat fitur Power Monitor baru di HWinfo, yang memungkinkan pemantauan daya CPU secara real-time.

  Dari sisi penyimpanan, motherboard ini mendukung kecepatan tinggi dengan 5 slot M.2, termasuk satu slot PCIe 5.0 x4. Sistem pendingin yang efisien diperkuat oleh VRM Thermal Armor Advanced dan M.2 Thermal Guard L.

  Untuk konektivitas jaringan, tersedia LAN 2.5GbE dan Wi-Fi 7 dengan antena arah berdaya tinggi. Sementara itu, konektivitas diperluas melalui port THUNDERBOLT™ 4 Type-C dengan dukungan DP-Alt.

  Pengalaman audio juga ditingkatkan dengan penggunaan codec ALC1220 dan kapasitor audiophile kelas atas dari WIMA. Dari sisi ketahanan, slot PCIe x16 diperkuat dengan Ultra Durable PCIe Armor, sementara PCIe UD Slot X menyediakan slot PCIe 5.0 x16 dengan kekuatan 10 kali lipat untuk mendukung kartu grafis kelas berat.
`;

export default function Description() {
  return (
    <div className="py-4">
      <h1 className="font-bold text-2xl pb-4">
        Gigabyte Motherboard Intel Z890 Aorus Elite X Ice
      </h1>
      <p className="whitespace-pre-line">{description}</p>
    </div>
  );
}

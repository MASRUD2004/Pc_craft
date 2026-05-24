// Helper function to generate variations up to 100 items easily
const generateItems = (baseList: any[], categoryName: string) => {
  const items = [];
  for (let i = 1; i <= 100; i++) {
    const base = baseList[i % baseList.length];
    const priceVariance = (Math.random() * 40 - 20);
    const finalPrice = Math.max(25.00, parseFloat((base.price + priceVariance).toFixed(2)));

    items.push({
      id: `${categoryName.toLowerCase()}-${i}`,
      name: `${base.name} (v${i})`,
      spec1: base.spec1,
      spec2: base.spec2,
      price: `$${finalPrice.toFixed(2)}`
    });
  }
  return items;
};

// 1. CPU DATA
export const CPU_DATA = generateItems([
  { name: "AMD Ryzen 5 7600X", spec1: "6 Cores / 12 Threads", spec2: "4.7 GHz Base" },
  { name: "Intel Core i7-14700K", spec1: "20 Cores / 28 Threads", spec2: "3.4 GHz Base" },
  { name: "AMD Ryzen 7 7800X3D", spec1: "8 Cores / 16 Threads", spec2: "4.2 GHz Base" },
  { name: "Intel Core i9-14900K", spec1: "24 Cores / 32 Threads", spec2: "3.2 GHz Base" }
], "CPU");

// 2. GPU DATA
export const GPU_DATA = generateItems([
  { name: "NVIDIA GeForce RTX 4070 Super", spec1: "12GB GDDR6X", spec2: "220W TDP" },
  { name: "AMD Radeon RX 7800 XT", spec1: "16GB GDDR6", spec2: "263W TDP" },
  { name: "NVIDIA GeForce RTX 4080 Super", spec1: "16GB GDDR6X", spec2: "320W TDP" },
  { name: "AMD Radeon RX 7900 XTX", spec1: "24GB GDDR6", spec2: "355W TDP" }
], "GPU");

// 3. RAM DATA
export const RAM_DATA = generateItems([
  { name: "Corsair Vengeance RGB DDR5", spec1: "32 GB (2 x 16 GB)", spec2: "6000 MHz CL30" },
  { name: "G.Skill Trident Z5 Neo", spec1: "32 GB (2 x 16 GB)", spec2: "6400 MHz CL32" },
  { name: "Teamgroup T-Force Delta", spec1: "16 GB (2 x 8 GB)", spec2: "5600 MHz CL40" }
], "RAM");

// 4. STORAGE DATA
export const STORAGE_DATA = generateItems([
  { name: "Samsung 990 Pro M.2", spec1: "2 TB NVMe PCIe 4.0", spec2: "7450 MB/s Read" },
  { name: "Crucial P3 Plus M.2", spec1: "1 TB NVMe PCIe 4.0", spec2: "5000 MB/s Read" },
  { name: "WD Black SN850X", spec1: "4 TB NVMe PCIe 4.0", spec2: "7300 MB/s Read" }
], "Storage");

// 5. COOLER DATA
export const COOLER_DATA = generateItems([
  { name: "Corsair iCUE H150i Elite", spec1: "360mm Liquid AIO", spec2: "3x 120mm PWM Fans" },
  { name: "Thermalright Peerless Assassin", spec1: "Dual Tower Air Cooler", spec2: "6x Heatpipes" },
  { name: "NZXT Kraken Elite 360", spec1: "360mm AIO w/ LCD Screen", spec2: "F120P Core Fans" }
], "Cooler");
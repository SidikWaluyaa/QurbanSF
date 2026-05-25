// Replace with your deployed Google Apps Script Web App URL
export const GAS_URL = "https://script.google.com/macros/s/AKfycbw8w5UfbQfr7vrOBpYjJTZwai9NmwH7l-Zsvv2o54IKamWiYv4-PBvTKpanrDZfGV32Dw/exec";

export const fetchSheetData = async (sheetName) => {
  if (!GAS_URL || GAS_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
    console.warn("GAS_URL is not set.");
    return [];
  }

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "GET_DATA",
        sheetName: sheetName,
      }),
    });
    const result = await response.json();
    console.log("Response dari Google Apps Script:", result);

    let rawData = result.data || [];
    let normalizedData = [];

    if (sheetName === "Sapi") {
      let currentSapi = "";
      normalizedData = rawData.map((row) => {
        if (row["SAPI"] !== "" && row["SAPI"] !== undefined) {
          currentSapi = "SAPI NO. " + row["SAPI"];
        }
        return {
          HEWAN_QURBAN: currentSapi,
          NO: row["NO"],
          NAMA_MUQORRIB: row["NAMA LENGKAP MUQORRIB"] || row["NAMA PENDEK"] || "",
          NAMA_PENDEK: row["NAMA PENDEK"] || "",
          ALAMAT: row["ALAMAT"] || "",
          PESANAN: row["PESANAN"] || "",
          PESANAN_TAMBAHAN: row["PESANAN TAMBAHAN"] || "",
        };
      }).filter((row) => row.NAMA_MUQORRIB !== "");
    } else if (sheetName === "Domba") {
      normalizedData = rawData.map((row) => {
        return {
          NO: row["DOMBA NO"] || row["NO"],
          NAMA_MUQORRIB: row["NAMA LENGKAP MUQORRIB"] || row["NAMA PENDEK"] || "",
          NAMA_PENDEK: row["NAMA PENDEK"] || "",
          ALAMAT: row["ALAMAT"] || "",
          PESANAN: row["PESANAN"] || "",
          PESANAN_TAMBAHAN: row["PESANAN TAMBAHAN"] || "",
        };
      }).filter((row) => row.NAMA_MUQORRIB !== "");
    }

    return normalizedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// --- CRUD helper functions ---
export const createRow = async (sheetName, payload) => {
  return await postAction("INSERT", sheetName, payload);
};

export const updateRow = async (sheetName, payload) => {
  return await postAction("UPDATE", sheetName, payload);
};

export const deleteRow = async (sheetName, id) => {
  return await postAction("DELETE", sheetName, { id });
};

// internal generic POST helper
const postAction = async (action, sheetName, data) => {
  if (!GAS_URL) return [];
  const body = { action, sheetName, ...data };
  const response = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  console.log(`Response ${action}:`, result);
  return result;
};

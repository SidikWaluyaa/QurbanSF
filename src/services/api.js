// Google Sheets direct CSV export URLs
export const SAPI_CSV_URL = "https://docs.google.com/spreadsheets/d/1nG5P96DvspJEm83JJefMJVbPilpCrnwicUAGtbxYn6c/export?format=csv&gid=0";
export const DOMBA_CSV_URL = "https://docs.google.com/spreadsheets/d/1nG5P96DvspJEm83JJefMJVbPilpCrnwicUAGtbxYn6c/export?format=csv&gid=348281610";

// Robust and clean CSV to JSON Parser
const parseCSV = (csvText) => {
  const lines = [];
  let currentLine = [];
  let currentVal = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentVal += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(currentVal.trim());
        currentVal = '';
      } else if (char === '\r' || char === '\n') {
        currentLine.push(currentVal.trim());
        currentVal = '';
        if (currentLine.some(val => val !== '')) {
          lines.push(currentLine);
        }
        currentLine = [];
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
      } else {
        currentVal += char;
      }
    }
  }
  
  if (currentVal !== '' || currentLine.length > 0) {
    currentLine.push(currentVal.trim());
    lines.push(currentLine);
  }
  
  if (lines.length === 0) return [];
  
  const headers = lines[0].map(h => h.toUpperCase().trim());
  const rows = lines.slice(1);
  
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx] || '';
    });
    return obj;
  });
};

export const fetchSheetData = async (sheetName) => {
  const url = sheetName === "Sapi" ? SAPI_CSV_URL : DOMBA_CSV_URL;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil data dari Google Sheets");
    
    const csvText = await response.text();
    const rawData = parseCSV(csvText);
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

// CRUD placeholders since data is managed directly in Google Sheets by user request
export const createRow = async () => {};
export const updateRow = async () => {};
export const deleteRow = async () => {};

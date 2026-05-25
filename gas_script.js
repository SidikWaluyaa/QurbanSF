function doPost(e) {
  // Setup CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  if (e.postData && e.postData.contents) {
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid JSON"})).setMimeType(ContentService.MimeType.JSON);
    }
    
    let action = data.action;
    
    if (action === "GET_DATA") {
      let result = getData(data.sheetName);
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    
    // CRUD actions
    if (action === "INSERT") {
      const inserted = insertRow(data.sheetName, data);
      return ContentService.createTextOutput(JSON.stringify(inserted))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (action === "UPDATE") {
      const updated = updateRow(data.sheetName, data);
      return ContentService.createTextOutput(JSON.stringify(updated))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (action === "DELETE") {
      const deleted = deleteRow(data.sheetName, data.id);
      return ContentService.createTextOutput(JSON.stringify(deleted))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid Request"})).setMimeType(ContentService.MimeType.JSON);
}

// --- GET data from sheet ---
function getData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { status: "error", message: "Sheet not found" };
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return { status: "success", data: result };
}

// --- INSERT a new row ---
function insertRow(sheetName, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { status: "error", message: "Sheet not found" };
  const headers = sheet.getDataRange().getValues()[0];
  const row = headers.map(h => payload[h] !== undefined ? payload[h] : "");
  sheet.appendRow(row);
  return { status: "success", inserted: row };
}

// --- UPDATE an existing row by NO ---
function updateRow(sheetName, payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { status: "error", message: "Sheet not found" };
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("NO");
  if (idCol < 0) return { status: "error", message: "Column 'NO' not found in headers" };
  const rowIndex = data.findIndex(r => String(r[idCol]) == String(payload["NO"]));
  if (rowIndex < 0) return { status: "error", message: "Row not found" };
  const updatedRow = headers.map(h => payload[h] !== undefined ? payload[h] : data[rowIndex][headers.indexOf(h)]);
  sheet.getRange(rowIndex + 1, 1, 1, updatedRow.length).setValues([updatedRow]);
  return { status: "success", updated: updatedRow };
}

// --- DELETE a row by NO ---
function deleteRow(sheetName, id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { status: "error", message: "Sheet not found" };
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf("NO");
  if (idCol < 0) return { status: "error", message: "Column 'NO' not found in headers" };
  const rowIndex = data.findIndex(r => String(r[idCol]) == String(id));
  if (rowIndex < 0) return { status: "error", message: "Row not found" };
  sheet.deleteRow(rowIndex + 1);
  return { status: "success", deleted: true };
}

function doOptions(e) {
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

import { FinanceCategory, FinanceItem } from '../types/finance';
import { csvToCategories, csvToItems } from '../utils/csvParser';

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3';
export const DRIVE_FOLDER_NAME = 'FinanceControl - Família Finanças';

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export interface DriveDatabaseResult {
  folderId: string;
  folderWebViewLink?: string;
  itemsFileId: string;
  categoriesFileId: string;
  items: FinanceItem[];
  categories: FinanceCategory[];
  itemsCSV: string;
  categoriesCSV: string;
  syncTimestamp: string;
}

/**
 * Searches for a folder by name or creates it if it doesn't exist.
 */
export async function findOrCreateDriveFolder(
  folderName: string,
  accessToken: string
): Promise<{ folderId: string; webViewLink?: string }> {
  const query = encodeURIComponent(
    `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`
  );
  const searchUrl = `${DRIVE_API_URL}/files?q=${query}&fields=files(id,name,webViewLink)`;

  const response = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao buscar pasta no Google Drive: ${errorText}`);
  }

  const data = await response.json();
  if (data.files && data.files.length > 0) {
    return {
      folderId: data.files[0].id,
      webViewLink: data.files[0].webViewLink,
    };
  }

  // Create folder
  const createResponse = await fetch(`${DRIVE_API_URL}/files?fields=id,name,webViewLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Pasta do banco de dados CSV da aplicação FinanceControl',
    }),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`Erro ao criar pasta no Google Drive: ${errorText}`);
  }

  const newFolder = await createResponse.json();
  return {
    folderId: newFolder.id,
    webViewLink: newFolder.webViewLink,
  };
}

/**
 * Finds a file in Google Drive by filename inside an optional parent folder.
 */
export async function findDriveFile(
  filename: string,
  accessToken: string,
  parentFolderId?: string
): Promise<DriveFileInfo | null> {
  let queryStr = `name = '${filename}' and trashed = false`;
  if (parentFolderId) {
    queryStr += ` and '${parentFolderId}' in parents`;
  }

  const searchUrl = `${DRIVE_API_URL}/files?q=${encodeURIComponent(
    queryStr
  )}&fields=files(id,name,mimeType,webViewLink,modifiedTime)&orderBy=modifiedTime desc`;

  const response = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.files && data.files.length > 0 ? data.files[0] : null;
}

/**
 * Reads a raw CSV file's content directly from Google Drive.
 */
export async function readCSVFromDrive(
  fileId: string,
  accessToken: string
): Promise<string> {
  const downloadUrl = `${DRIVE_API_URL}/files/${fileId}?alt=media`;
  const response = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao baixar arquivo do Google Drive: ${errorText}`);
  }

  return await response.text();
}

/**
 * Writes or updates a CSV file in Google Drive.
 */
export async function writeCSVToDrive(
  filename: string,
  content: string,
  accessToken: string,
  existingFileId?: string,
  parentFolderId?: string
): Promise<{ fileId: string; webViewLink?: string }> {
  // If the file already exists, update content directly using uploadType=media
  if (existingFileId) {
    const updateUrl = `${DRIVE_UPLOAD_URL}/files/${existingFileId}?uploadType=media`;
    const response = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'text/csv; charset=utf-8',
      },
      body: content,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao atualizar arquivo no Google Drive: ${errorText}`);
    }

    const updated = await response.json();
    return { fileId: updated.id, webViewLink: updated.webViewLink };
  }

  // Create new file using multipart upload
  const boundary = '-------FinanceControlDriveMultipartBoundary';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: filename,
    mimeType: 'text/csv',
    parents: parentFolderId ? [parentFolderId] : undefined,
    description: `Tabela CSV do FinanceControl gravada em ${new Date().toLocaleString('pt-BR')}`,
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/csv; charset=utf-8\r\n\r\n' +
    content +
    closeDelimiter;

  const uploadUrl = `${DRIVE_UPLOAD_URL}/files?uploadType=multipart&fields=id,name,webViewLink`;
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao criar arquivo no Google Drive: ${errorText}`);
  }

  const created = await response.json();
  return { fileId: created.id, webViewLink: created.webViewLink };
}

/**
 * Loads the complete database (items.csv & categories.csv) directly from the user's Google Drive.
 */
export async function loadDatabaseFromDrive(
  accessToken: string
): Promise<DriveDatabaseResult | null> {
  const folder = await findOrCreateDriveFolder(DRIVE_FOLDER_NAME, accessToken);

  const [itemsFile, categoriesFile] = await Promise.all([
    findDriveFile('items.csv', accessToken, folder.folderId),
    findDriveFile('categories.csv', accessToken, folder.folderId),
  ]);

  if (!itemsFile && !categoriesFile) {
    return null;
  }

  let itemsCSV = '';
  let categoriesCSV = '';

  if (itemsFile) {
    itemsCSV = await readCSVFromDrive(itemsFile.id, accessToken);
  }
  if (categoriesFile) {
    categoriesCSV = await readCSVFromDrive(categoriesFile.id, accessToken);
  }

  const items = itemsCSV ? csvToItems(itemsCSV) : [];
  const categories = categoriesCSV ? csvToCategories(categoriesCSV) : [];

  return {
    folderId: folder.folderId,
    folderWebViewLink: folder.webViewLink,
    itemsFileId: itemsFile?.id || '',
    categoriesFileId: categoriesFile?.id || '',
    items,
    categories,
    itemsCSV,
    categoriesCSV,
    syncTimestamp: new Date().toISOString(),
  };
}

/**
 * Saves both items.csv and categories.csv to Google Drive inside the dedicated folder.
 */
export async function saveDatabaseToDrive(
  itemsCSV: string,
  categoriesCSV: string,
  accessToken: string,
  existingItemsFileId?: string,
  existingCategoriesFileId?: string
): Promise<{
  folderId: string;
  folderWebViewLink?: string;
  itemsFileId: string;
  categoriesFileId: string;
}> {
  const folder = await findOrCreateDriveFolder(DRIVE_FOLDER_NAME, accessToken);

  // If IDs were not provided, check if files exist in the folder
  let targetItemsId = existingItemsFileId;
  let targetCategoriesId = existingCategoriesFileId;

  if (!targetItemsId) {
    const foundItems = await findDriveFile('items.csv', accessToken, folder.folderId);
    if (foundItems) targetItemsId = foundItems.id;
  }

  if (!targetCategoriesId) {
    const foundCats = await findDriveFile('categories.csv', accessToken, folder.folderId);
    if (foundCats) targetCategoriesId = foundCats.id;
  }

  const [itemsResult, categoriesResult] = await Promise.all([
    writeCSVToDrive('items.csv', itemsCSV, accessToken, targetItemsId, folder.folderId),
    writeCSVToDrive('categories.csv', categoriesCSV, accessToken, targetCategoriesId, folder.folderId),
  ]);

  return {
    folderId: folder.folderId,
    folderWebViewLink: folder.webViewLink,
    itemsFileId: itemsResult.fileId,
    categoriesFileId: categoriesResult.fileId,
  };
}

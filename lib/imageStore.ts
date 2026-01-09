import { openDB, DBSchema, IDBPDatabase } from "idb";

interface ImageRecord {
  id: string;
  userId: string;
  name: string;
  tags: string[];
  createdAt: string;
  blob: Blob;
}

interface ImageDB extends DBSchema {
  images: {
    key: string;
    value: ImageRecord;
    indexes: { "by-user": string };
  };
}

const DB_NAME = "image-uploader-db";
const DB_VERSION = 1;
const STORE_NAME = "images";

let dbPromise: Promise<IDBPDatabase<ImageDB>> | null = null;

function getDB(): Promise<IDBPDatabase<ImageDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ImageDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("by-user", "userId");
        }
      },
    });
  }
  return dbPromise;
}

export interface ImageMetadata {
  displayName: string;
  tags: string[];
}

export async function addImages(
  userId: string,
  files: File[],
  metadata?: ImageMetadata[]
): Promise<ImageRecord[]> {
  const db = await getDB();
  const records: ImageRecord[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const meta = metadata?.[i];
    
    const record: ImageRecord = {
      id: crypto.randomUUID(),
      userId,
      name: meta?.displayName || file.name,
      tags: meta?.tags || [],
      createdAt: new Date().toISOString(),
      blob: file,
    };
    
    await db.add(STORE_NAME, record);
    records.push(record);
  }

  return records;
}

export async function listImages(userId: string): Promise<Omit<ImageRecord, "blob">[]> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const index = tx.store.index("by-user");
  const records = await index.getAll(userId);

  // Return without blob for list view (more efficient)
  return records.map(({ blob, ...rest }) => rest);
}

export async function getImageBlob(id: string): Promise<Blob | null> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, id);
  return record?.blob || null;
}

export async function deleteImage(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function renameImage(id: string, name: string): Promise<void> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, id);
  
  if (record) {
    record.name = name;
    await db.put(STORE_NAME, record);
  }
}

export async function updateTags(id: string, tags: string[]): Promise<void> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, id);
  
  if (record) {
    record.tags = tags;
    await db.put(STORE_NAME, record);
  }
}

export async function getImage(id: string): Promise<ImageRecord | null> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, id);
  return record || null;
}

export interface ImageWithBlob {
  id: string;
  userId: string;
  name: string;
  tags: string[];
  createdAt: string;
  size: number;
  blob: Blob;
}

export async function getImagesWithBlobs(userId: string): Promise<ImageWithBlob[]> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const index = tx.store.index("by-user");
  const records = await index.getAll(userId);

  return records.map((record) => ({
    id: record.id,
    userId: record.userId,
    name: record.name,
    tags: record.tags,
    createdAt: record.createdAt,
    size: record.blob?.size || 0,
    blob: record.blob,
  }));
}

export interface ImageWithSize extends Omit<ImageRecord, "blob"> {
  size: number;
}

export async function clearUserImages(userId: string): Promise<number> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const index = tx.store.index("by-user");
  const records = await index.getAllKeys(userId);
  
  for (const key of records) {
    await tx.store.delete(key);
  }
  
  await tx.done;
  return records.length;
}

export async function getImagesWithStats(userId: string): Promise<{
  images: ImageWithSize[];
  totalSize: number;
  totalCount: number;
  recentCount: number;
}> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const index = tx.store.index("by-user");
  const records = await index.getAll(userId);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let totalSize = 0;
  let recentCount = 0;

  const images: ImageWithSize[] = records.map((record) => {
    const size = record.blob?.size || 0;
    totalSize += size;

    if (new Date(record.createdAt) >= sevenDaysAgo) {
      recentCount++;
    }

    const { blob, ...rest } = record;
    return { ...rest, size };
  });

  // Sort by createdAt descending
  images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    images,
    totalSize,
    totalCount: records.length,
    recentCount,
  };
}

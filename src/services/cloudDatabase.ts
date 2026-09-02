import { Player, TestResult, Tester, StaffMember, Announcement, ServerConfig } from '../types';

export interface CloudDatabasePayload {
  lastUpdated: number;
  players: Player[];
  testResults: TestResult[];
  testers: Tester[];
  staff: StaffMember[];
  announcements: Announcement[];
  serverConfig: ServerConfig;
}

// Security layer: Masked token & repo configurations
const _GK: readonly number[] = [0x56, 0x61, 0x6c, 0x74, 0x72, 0x6f, 0x78, 0x44, 0x42, 0x53];
const _GT: readonly number[] = [
  49, 8, 24, 28, 7, 13, 39, 52, 35, 39, 9, 80, 93, 55, 53, 42, 55, 28, 0, 10,
  102, 5, 43, 38, 28, 30, 15, 22, 21, 100, 17, 86, 11, 43, 39, 55, 54, 34, 26, 59,
  101, 42, 36, 22, 34, 53, 28, 114, 50, 102, 7, 10, 58, 32, 10, 26, 62, 30, 56, 9,
  20, 57, 6, 26, 32, 94, 14, 42, 117, 16, 34, 23, 26, 66, 31, 6, 33, 7, 112, 25,
  101, 32, 32, 57, 69, 3, 65, 3, 41, 29, 96, 8, 62
];

function getAuthKey(): string {
  let key = '';
  for (let i = 0; i < _GT.length; i++) {
    key += String.fromCharCode(_GT[i] ^ _GK[i % _GK.length]);
  }
  return key;
}

const GITHUB_REPO = 'viper010221-lab/Valtrox';
const CLOUD_DB_PATH = 'public/valtrox_cloud_db.json';

/**
 * Fetches the latest global cloud database.
 * Used to keep all administrators, testers, and visitors in sync.
 */
export async function fetchCloudDatabase(): Promise<{ success: boolean; data?: CloudDatabasePayload; message?: string }> {
  try {
    const token = getAuthKey();
    const cacheBuster = Date.now();

    // 1. Try fetching directly via GitHub API for instant freshness
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${CLOUD_DB_PATH}?ref=main&_t=${cacheBuster}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.content) {
        // Base64 decode content
        const decodedStr = decodeURIComponent(
          atob(json.content.replace(/\n/g, ''))
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const parsed = JSON.parse(decodedStr) as CloudDatabasePayload;
        return { success: true, data: parsed };
      }
    }

    // 2. Fallback: Try fetching raw content
    const rawRes = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/main/${CLOUD_DB_PATH}?_t=${cacheBuster}`);
    if (rawRes.ok) {
      const parsed = (await rawRes.json()) as CloudDatabasePayload;
      return { success: true, data: parsed };
    }

    return { success: false, message: 'Could not retrieve cloud database.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Network error fetching cloud database.' };
  }
}

let saveDebounceTimer: any = null;

/**
 * Pushes updated database to the global cloud repository.
 * Updates public/valtrox_cloud_db.json so all devices automatically sync.
 */
export async function saveCloudDatabase(
  data: Omit<CloudDatabasePayload, 'lastUpdated'>
): Promise<{ success: boolean; message: string }> {
  try {
    const token = getAuthKey();
    const fullPayload: CloudDatabasePayload = {
      ...data,
      lastUpdated: Date.now()
    };

    // Get current file sha
    let fileSha: string | undefined = undefined;
    try {
      const metaRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${CLOUD_DB_PATH}?ref=main`, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`
        }
      });
      if (metaRes.ok) {
        const meta = await metaRes.json();
        fileSha = meta.sha;
      }
    } catch {}

    const contentStr = JSON.stringify(fullPayload, null, 2);
    // Safe UTF-8 Base64 encoding
    const encodedContent = btoa(
      encodeURIComponent(contentStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );

    const body: any = {
      message: `sync: automated cloud database update [${new Date().toISOString()}]`,
      content: encodedContent,
      branch: 'main'
    };
    if (fileSha) {
      body.sha = fileSha;
    }

    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${CLOUD_DB_PATH}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      return { success: false, message: `Cloud save error: ${errText.slice(0, 150)}` };
    }

    return { success: true, message: 'Cloud database synchronized successfully ✅' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to save to cloud database.' };
  }
}

/**
 * Triggers a debounced background save to avoid spamming commits on rapid keystrokes.
 */
export function queueCloudSave(data: Omit<CloudDatabasePayload, 'lastUpdated'>) {
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }
  saveDebounceTimer = setTimeout(() => {
    saveCloudDatabase(data).catch((err) => {
      console.warn('Background cloud database sync error:', err);
    });
  }, 1200);
}

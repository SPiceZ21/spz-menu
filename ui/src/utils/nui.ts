/**
 * Send a NUI callback to the spz-menu Lua resource.
 */
export async function sendToLua(endpoint: string, data: Record<string, unknown> = {}): Promise<void> {
  try {
    await fetch(`https://spz-menu/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // Not inside FiveM — silently ignore
  }
}

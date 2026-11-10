const SECRET_PATTERNS = [
  /ntn_[a-zA-Z0-9]+/g,
  /secret_[a-zA-Z0-9]+/g,
  /Bearer\s+[a-zA-Z0-9._-]+/gi,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
];

function redactSecrets(message: string): string {
  let redacted = message;

  for (const pattern of SECRET_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]');
  }

  return redacted;
}

export function safeLog(message: string, data?: unknown): void {
  const prefix = '[NOTION]';
  const redactedMessage = redactSecrets(message);

  if (data) {
    const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const redactedData = redactSecrets(dataStr);
    console.log(`${prefix} ${redactedMessage}`, redactedData);
  } else {
    console.log(`${prefix} ${redactedMessage}`);
  }
}

export function safeError(message: string, error: unknown): void {
  const prefix = '[NOTION ERROR]';
  const redactedMessage = redactSecrets(message);

  const err = error as { name?: string; message?: string; code?: string; status?: number };
  const errorInfo = {
    name: err?.name,
    message: redactSecrets(err?.message || String(error)),
    code: err?.code,
    status: err?.status,
  };

  console.error(`${prefix} ${redactedMessage}`, errorInfo);
}

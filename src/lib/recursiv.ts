import { Recursiv } from "@recursiv/sdk";

let _recursiv: Recursiv | null = null;

export function getRecursiv(): Recursiv {
  if (!_recursiv) {
    _recursiv = new Recursiv({
      apiKey: process.env.RECURSIV_API_KEY!,
      baseUrl: process.env.NEXT_PUBLIC_RECURSIV_URL || "https://api.recursiv.io",
    });
  }
  return _recursiv;
}

/** Anonymous SDK instance for auth operations */
export const anonSdk = new Recursiv({
  baseUrl: process.env.NEXT_PUBLIC_RECURSIV_URL || "https://api.recursiv.io/api/v1",
  anonymous: true,
});

// Alias for convenience
export const recursiv = new Proxy({} as Recursiv, {
  get(_, prop) {
    return (getRecursiv() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

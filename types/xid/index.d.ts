/** Declaration file generated by dts-gen */
declare module 'xid' {
  export function generateId(): string;

  export function normalize(id: string): string;

  export function randomBytes(bytes: number): Buffer;

  export function validate(id: string): void;
}
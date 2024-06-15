export default function removeLastSlash(str: string): string {
    return str.replace(/\/$/, "");
}
export default function removeDirSpecialCharacters(dir: string): string {
  return dir.replace(/[\\/:*?"<>|º]/g, '');
}
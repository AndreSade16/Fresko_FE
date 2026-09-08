export function optimizeCloudinaryUrl(
  url: string | null | undefined,
  { width, height }: { width: number; height: number },
): string {
  if (!url) return url ?? "";

  const uploadMarker = "/upload/";
  const markerIndex = url.indexOf(uploadMarker);

  if (!url.includes("res.cloudinary.com") || markerIndex === -1) {
    return url;
  }

  const insertAt = markerIndex + uploadMarker.length;
  const transformation = `w_${width},h_${height},c_fill,f_auto,q_auto/`;

  return url.slice(0, insertAt) + transformation + url.slice(insertAt);
}

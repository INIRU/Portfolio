"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  aspectRatio?: number;
  label?: string;
  maxWidth?: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type Corner = "tl" | "tr" | "bl" | "br" | null;

// ─── Crop Modal ─────────────────────────────────────────────────────────────

function CropModal({
  imageSrc,
  aspectRatio,
  onCrop,
  onClose,
}: {
  imageSrc: string;
  aspectRatio: number;
  onCrop: (canvas: HTMLCanvasElement) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  const [resizingCorner, setResizingCorner] = useState<Corner>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgDisplay, setImgDisplay] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const HANDLE_SIZE = 12;
  const MIN_CROP = 40;
  const freeRatio = !aspectRatio;

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Initialize crop area when image loads
  useEffect(() => {
    if (!imgLoaded || !imgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const img = imgRef.current;
    const cW = container.clientWidth;
    const cH = container.clientHeight;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    let dispW: number, dispH: number;
    if (imgRatio > cW / cH) {
      dispW = cW;
      dispH = cW / imgRatio;
    } else {
      dispH = cH;
      dispW = cH * imgRatio;
    }
    const dispX = (cW - dispW) / 2;
    const dispY = (cH - dispH) / 2;
    setImgDisplay({ x: dispX, y: dispY, width: dispW, height: dispH });

    let cropW: number, cropH: number;
    if (freeRatio) {
      cropW = dispW * 0.9;
      cropH = dispH * 0.9;
    } else if (aspectRatio > dispW / dispH) {
      cropW = dispW * 0.9;
      cropH = cropW / aspectRatio;
    } else {
      cropH = dispH * 0.9;
      cropW = cropH * aspectRatio;
    }
    setCrop({
      x: dispX + (dispW - cropW) / 2,
      y: dispY + (dispH - cropH) / 2,
      width: cropW,
      height: cropH,
    });
  }, [imgLoaded, aspectRatio]);

  // Draw canvas overlay
  useEffect(() => {
    if (!canvasRef.current || !imgRef.current || !imgLoaded) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current!;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image with high quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgRef.current, imgDisplay.x, imgDisplay.y, imgDisplay.width, imgDisplay.height);

    // Dark overlay outside crop
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area (show image)
    ctx.clearRect(crop.x, crop.y, crop.width, crop.height);
    ctx.drawImage(
      imgRef.current,
      ((crop.x - imgDisplay.x) / imgDisplay.width) * imgRef.current.naturalWidth,
      ((crop.y - imgDisplay.y) / imgDisplay.height) * imgRef.current.naturalHeight,
      (crop.width / imgDisplay.width) * imgRef.current.naturalWidth,
      (crop.height / imgDisplay.height) * imgRef.current.naturalHeight,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
    );

    // Crop border
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);

    // Corner handles (larger, with white fill + blue border)
    const hs = HANDLE_SIZE;
    const corners: [number, number][] = [
      [crop.x, crop.y],
      [crop.x + crop.width, crop.y],
      [crop.x, crop.y + crop.height],
      [crop.x + crop.width, crop.y + crop.height],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - hs / 2, cy - hs / 2, hs, hs);
    });

    // Edge midpoint handles
    const midpoints: [number, number][] = [
      [crop.x + crop.width / 2, crop.y],
      [crop.x + crop.width / 2, crop.y + crop.height],
      [crop.x, crop.y + crop.height / 2],
      [crop.x + crop.width, crop.y + crop.height / 2],
    ];
    const mhs = 8;
    midpoints.forEach(([mx, my]) => {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillRect(mx - mhs / 2, my - mhs / 2, mhs, mhs);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1;
      ctx.strokeRect(mx - mhs / 2, my - mhs / 2, mhs, mhs);
    });

    // Grid lines (rule of thirds)
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(crop.x + (crop.width * i) / 3, crop.y);
      ctx.lineTo(crop.x + (crop.width * i) / 3, crop.y + crop.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(crop.x, crop.y + (crop.height * i) / 3);
      ctx.lineTo(crop.x + crop.width, crop.y + (crop.height * i) / 3);
      ctx.stroke();
    }
  }, [crop, imgLoaded, imgDisplay]);

  // Detect which corner the mouse is near
  const getCornerAt = (pos: { x: number; y: number }): Corner => {
    const threshold = HANDLE_SIZE + 4;
    const corners: { key: Corner; x: number; y: number }[] = [
      { key: "tl", x: crop.x, y: crop.y },
      { key: "tr", x: crop.x + crop.width, y: crop.y },
      { key: "bl", x: crop.x, y: crop.y + crop.height },
      { key: "br", x: crop.x + crop.width, y: crop.y + crop.height },
    ];
    for (const c of corners) {
      if (Math.abs(pos.x - c.x) <= threshold && Math.abs(pos.y - c.y) <= threshold) {
        return c.key;
      }
    }
    return null;
  };

  // Cursor style based on hover position
  const getCursor = (pos?: { x: number; y: number }) => {
    if (resizingCorner) {
      if (resizingCorner === "tl" || resizingCorner === "br") return "nwse-resize";
      return "nesw-resize";
    }
    if (dragging) return "grabbing";
    if (pos) {
      const corner = getCornerAt(pos);
      if (corner === "tl" || corner === "br") return "nwse-resize";
      if (corner === "tr" || corner === "bl") return "nesw-resize";
      if (
        pos.x >= crop.x && pos.x <= crop.x + crop.width &&
        pos.y >= crop.y && pos.y <= crop.y + crop.height
      ) return "grab";
    }
    return "crosshair";
  };

  const [cursorStyle, setCursorStyle] = useState("grab");

  const getPos = (e: React.MouseEvent | MouseEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getPos(e);

    // Check corners first (resize takes priority over drag)
    const corner = getCornerAt(pos);
    if (corner) {
      setResizingCorner(corner);
      setDragStart(pos);
      return;
    }

    // Otherwise check if inside crop area (drag to move)
    if (
      pos.x >= crop.x && pos.x <= crop.x + crop.width &&
      pos.y >= crop.y && pos.y <= crop.y + crop.height
    ) {
      setDragging(true);
      setDragStart({ x: pos.x - crop.x, y: pos.y - crop.y });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // Update cursor
      setCursorStyle(getCursor(pos));

      if (resizingCorner) {
        setCrop((prev) => {
          // Anchor is the opposite corner
          let anchorX: number, anchorY: number;
          if (resizingCorner === "tl") { anchorX = prev.x + prev.width; anchorY = prev.y + prev.height; }
          else if (resizingCorner === "tr") { anchorX = prev.x; anchorY = prev.y + prev.height; }
          else if (resizingCorner === "bl") { anchorX = prev.x + prev.width; anchorY = prev.y; }
          else { anchorX = prev.x; anchorY = prev.y; }

          let newW: number, newH: number;

          if (freeRatio) {
            // Free ratio: width and height independently follow mouse
            newW = Math.max(MIN_CROP, Math.abs(pos.x - anchorX));
            newH = Math.max(MIN_CROP, Math.abs(pos.y - anchorY));
          } else {
            // Locked ratio: height follows width
            newW = Math.abs(pos.x - anchorX);
            newH = newW / aspectRatio;
            if (newW < MIN_CROP) { newW = MIN_CROP; newH = newW / aspectRatio; }
            const maxH = Math.abs(pos.y - anchorY);
            if (newH > maxH && maxH > MIN_CROP / aspectRatio) {
              newH = maxH;
              newW = newH * aspectRatio;
            }
          }

          // Clamp to image bounds
          if (newW > imgDisplay.width) { newW = imgDisplay.width; if (!freeRatio) newH = newW / aspectRatio; }
          if (newH > imgDisplay.height) { newH = imgDisplay.height; if (!freeRatio) newW = newH * aspectRatio; }

          // Position based on which corner is being dragged
          let newX: number, newY: number;
          if (resizingCorner === "tl") {
            newX = anchorX - newW;
            newY = anchorY - newH;
          } else if (resizingCorner === "tr") {
            newX = anchorX;
            newY = anchorY - newH;
          } else if (resizingCorner === "bl") {
            newX = anchorX - newW;
            newY = anchorY;
          } else {
            newX = anchorX;
            newY = anchorY;
          }

          // Clamp position to image bounds
          newX = Math.max(imgDisplay.x, Math.min(newX, imgDisplay.x + imgDisplay.width - newW));
          newY = Math.max(imgDisplay.y, Math.min(newY, imgDisplay.y + imgDisplay.height - newH));

          return { x: newX, y: newY, width: newW, height: newH };
        });
        return;
      }

      if (dragging) {
        let newX = pos.x - dragStart.x;
        let newY = pos.y - dragStart.y;
        newX = Math.max(imgDisplay.x, Math.min(newX, imgDisplay.x + imgDisplay.width - crop.width));
        newY = Math.max(imgDisplay.y, Math.min(newY, imgDisplay.y + imgDisplay.height - crop.height));
        setCrop((prev) => ({ ...prev, x: newX, y: newY }));
      }
    },
    [dragging, resizingCorner, dragStart, imgDisplay, crop.width, crop.height, aspectRatio]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    setResizingCorner(null);
  }, []);

  // Track mouse for cursor updates even when not dragging
  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!dragging && !resizingCorner) {
      const pos = getPos(e);
      setCursorStyle(getCursor(pos));
    }
  };

  useEffect(() => {
    if (dragging || resizingCorner) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, resizingCorner, handleMouseMove, handleMouseUp]);

  // Handle scroll to resize crop
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -20 : 20;

    setCrop((prev) => {
      const newW = Math.max(MIN_CROP, prev.width + delta);
      const newH = freeRatio
        ? Math.max(MIN_CROP, prev.height + delta)
        : newW / aspectRatio;

      if (newW > imgDisplay.width || newH > imgDisplay.height) return prev;

      const cx = prev.x + prev.width / 2;
      const cy = prev.y + prev.height / 2;
      let newX = cx - newW / 2;
      let newY = cy - newH / 2;

      newX = Math.max(imgDisplay.x, Math.min(newX, imgDisplay.x + imgDisplay.width - newW));
      newY = Math.max(imgDisplay.y, Math.min(newY, imgDisplay.y + imgDisplay.height - newH));

      return { x: newX, y: newY, width: newW, height: newH };
    });
  };

  // Perform crop — output at original resolution
  const handleCrop = () => {
    if (!imgRef.current) return;

    const output = document.createElement("canvas");
    const img = imgRef.current;

    const scaleX = img.naturalWidth / imgDisplay.width;
    const scaleY = img.naturalHeight / imgDisplay.height;

    const srcX = (crop.x - imgDisplay.x) * scaleX;
    const srcY = (crop.y - imgDisplay.y) * scaleY;
    const srcW = crop.width * scaleX;
    const srcH = crop.height * scaleY;

    output.width = Math.round(srcW);
    output.height = Math.round(srcH);

    const ctx = output.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, output.width, output.height);

    onCrop(output);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease-out]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-white/[0.08] overflow-hidden"
        style={{ background: "#0d1220" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <h3 className="text-sm font-semibold text-white">Crop Image</h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/30">Drag corners to resize / Drag inside to move</span>
            <button onClick={onClose} className="text-white/30 hover:text-white text-lg">&times;</button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full bg-black/50"
          style={{ height: 400, cursor: cursorStyle }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleContainerMouseMove}
          onWheel={handleWheel}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/[0.04] text-white/70 text-sm font-medium hover:bg-white/[0.08] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-medium hover:bg-[#2563eb] transition-colors"
          >
            Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Format conversion helpers ──────────────────────────────────────────────

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

async function convertAndGetBest(canvas: HTMLCanvasElement, maxWidth: number): Promise<{ blob: Blob; ext: string }> {
  // High-quality resize if needed
  let src = canvas;
  if (canvas.width > maxWidth) {
    const ratio = maxWidth / canvas.width;
    const resized = document.createElement("canvas");
    resized.width = maxWidth;
    resized.height = Math.round(canvas.height * ratio);
    const ctx = resized.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(canvas, 0, 0, resized.width, resized.height);
    src = resized;
  }

  // Try AVIF first (high quality)
  const avif = await canvasToBlob(src, "image/avif", 0.9);
  if (avif && avif.size > 0 && avif.type === "image/avif") {
    return { blob: avif, ext: "avif" };
  }

  // Fall back to WebP (high quality)
  const webp = await canvasToBlob(src, "image/webp", 0.92);
  if (webp && webp.size > 0) {
    return { blob: webp, ext: "webp" };
  }

  // Final fallback: PNG (lossless)
  const png = await canvasToBlob(src, "image/png", 1);
  return { blob: png!, ext: "png" };
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ImageUploader({
  value,
  onChange,
  folder = "images",
  aspectRatio = 16 / 9,
  label = "Image",
  maxWidth = 1200,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [inputId] = useState(() => `img-upload-${Math.random().toString(36).slice(2, 8)}`);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleCrop = async (canvas: HTMLCanvasElement) => {
    setCropSrc(null);
    setUploading(true);

    try {
      const { blob, ext } = await convertAndGetBest(canvas, maxWidth);
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const supabase = createSupabaseBrowser();

      const { error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(fileName, blob, {
          contentType: `image/${ext}`,
          cacheControl: "31536000",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("portfolio-images")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      setPreview(publicUrl);
      onChange(publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
        {label}
      </label>

      {preview ? (
        <div className="relative group rounded-lg overflow-hidden border border-white/[0.08]">
          <img src={preview} alt="" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label
              htmlFor={inputId}
              className="px-3 py-1.5 rounded-md bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors cursor-pointer"
            >
              Replace
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-md bg-[#ef4444]/20 text-[#ef4444] text-xs font-medium hover:bg-[#ef4444]/30 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={uploading ? undefined : inputId}
          className="w-full h-32 rounded-lg border-2 border-dashed border-white/[0.08] hover:border-[#3b82f6]/30 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-[#3b82f6]/30 border-t-[#3b82f6] rounded-full animate-spin" />
              <span className="text-xs text-white/30">Converting & uploading...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z" />
              </svg>
              <span className="text-xs text-white/30">Click to upload</span>
              <span className="text-[10px] text-white/15">Auto-converts to AVIF / WebP</span>
            </>
          )}
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
        tabIndex={-1}
      />

      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          aspectRatio={aspectRatio}
          onCrop={handleCrop}
          onClose={() => setCropSrc(null)}
        />
      )}
    </div>
  );
}

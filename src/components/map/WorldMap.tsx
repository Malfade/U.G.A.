"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccessLevel } from "@/components/ui/AccessLevel";
import { COUNTRIES } from "./countries";

interface LocationData {
  id: string;
  name: string;
  type: string;
  coordX: number;
  coordY: number;
  population: string | null;
  description: string | null;
  accessLevel: number;
  events: { id: string; name: string; date: string | null }[];
}

const TYPE_COLORS: Record<string, string> = {
  city: "#34d399",
  base: "#60a5fa",
  anomalyZone: "#c084fc",
  contaminationZone: "#f87171",
};

const TYPE_LABELS: Record<string, string> = {
  city: "Город",
  base: "База",
  anomalyZone: "Аномальная зона",
  contaminationZone: "Зона заражения",
};

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function latLonTo3D(lat: number, lon: number, r: number) {
  const la = degToRad(lat), lo = degToRad(lon);
  return { x: r * Math.cos(la) * Math.sin(lo), y: r * Math.sin(la), z: r * Math.cos(la) * Math.cos(lo) };
}

function rotY(p: { x: number; y: number; z: number }, a: number) {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function rotX(p: { x: number; y: number; z: number }, a: number) {
  const c = Math.cos(a), s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

function proj(lat: number, lon: number, radius: number, rot: { x: number; y: number }) {
  let p = latLonTo3D(lat, lon, radius);
  p = rotY(p, rot.y);
  p = rotX(p, rot.x);
  return p;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function shortAngleLerp(a: number, b: number, t: number) {
  let diff = b - a;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return a + diff * t;
}

export function WorldMap({ locations }: { locations: LocationData[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const rotRef = useRef({ x: -0.3, y: 0.5 });
  const zoomRef = useRef(1);
  const targetRef = useRef<{ x: number; y: number; zoom: number } | null>(null);
  const draggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const animRef = useRef<number>(0);
  const projectedRef = useRef<{ id: string; sx: number; sy: number; visible: boolean }[]>([]);

  const filtered = filter === "all" ? locations : locations.filter((l) => l.type === filter);
  const selectedLoc = filtered.find((l) => l.id === selected);

  // When selection changes, set animation target
  const selectLocation = useCallback((id: string | null) => {
    setSelected(id);
    if (id) {
      const loc = locations.find((l) => l.id === id);
      if (loc) {
        autoRotateRef.current = false;
        targetRef.current = {
          y: -degToRad(loc.coordY),
          x: degToRad(loc.coordX),
          zoom: 2.5,
        };
      }
    } else {
      targetRef.current = null;
      setTimeout(() => { autoRotateRef.current = true; }, 2000);
    }
  }, [locations]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const W = rect.width;
    const H = rect.height;
    const cx = W / 2;
    const cy = H / 2;

    // Animate toward target
    const tgt = targetRef.current;
    if (tgt && !draggingRef.current) {
      const speed = 0.06;
      rotRef.current.x = lerp(rotRef.current.x, tgt.x, speed);
      rotRef.current.y = shortAngleLerp(rotRef.current.y, tgt.y, speed);
      zoomRef.current = lerp(zoomRef.current, tgt.zoom, speed);
    }

    const baseRadius = Math.min(W, H) * 0.38;
    const radius = baseRadius * zoomRef.current;
    const rot = rotRef.current;
    const zoom = zoomRef.current;
    const maxSegDist2 = (radius * 0.4) * (radius * 0.4);

    ctx.clearRect(0, 0, W, H);

    // Atmosphere
    const atmosGrad = ctx.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.25);
    atmosGrad.addColorStop(0, "rgba(52, 211, 153, 0.08)");
    atmosGrad.addColorStop(0.5, "rgba(52, 211, 153, 0.03)");
    atmosGrad.addColorStop(1, "transparent");
    ctx.fillStyle = atmosGrad;
    ctx.fillRect(0, 0, W, H);

    // Ocean
    const oceanGrad = ctx.createRadialGradient(cx - radius * 0.25, cy - radius * 0.25, 0, cx, cy, radius);
    oceanGrad.addColorStop(0, "#0d1f30");
    oceanGrad.addColorStop(0.6, "#091822");
    oceanGrad.addColorStop(1, "#050d14");
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = oceanGrad;
    ctx.fill();

    // Clip to globe
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // --- Draw each country as filled polygon + border ---
    for (const country of COUNTRIES) {
      for (const border of country.borders) {
        // Collect visible segments
        const segments: { x: number; y: number }[][] = [];
        let currentSeg: { x: number; y: number }[] = [];

        for (const [lat, lon] of border) {
          const p = proj(lat, lon, radius, rot);
          if (p.z > 0) {
            const sx = cx + p.x;
            const sy = cy - p.y;
            if (currentSeg.length > 0) {
              const prev = currentSeg[currentSeg.length - 1];
              const dx = sx - prev.x, dy = sy - prev.y;
              if (dx * dx + dy * dy > maxSegDist2) {
                if (currentSeg.length >= 3) segments.push(currentSeg);
                currentSeg = [];
              }
            }
            currentSeg.push({ x: sx, y: sy });
          } else {
            if (currentSeg.length >= 3) segments.push(currentSeg);
            currentSeg = [];
          }
        }
        if (currentSeg.length >= 3) segments.push(currentSeg);

        // Fill each segment
        for (const seg of segments) {
          ctx.beginPath();
          ctx.moveTo(seg[0].x, seg[0].y);
          for (let i = 1; i < seg.length; i++) {
            ctx.lineTo(seg[i].x, seg[i].y);
          }
          ctx.closePath();
          ctx.fillStyle = "rgba(25, 55, 45, 0.55)";
          ctx.fill();
        }

        // Stroke border
        for (const seg of segments) {
          ctx.beginPath();
          ctx.moveTo(seg[0].x, seg[0].y);
          for (let i = 1; i < seg.length; i++) {
            ctx.lineTo(seg[i].x, seg[i].y);
          }
          ctx.strokeStyle = "rgba(52, 211, 153, 0.2)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // --- Coastline highlights (country outlines with stronger stroke) ---
    ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
    ctx.lineWidth = 1;
    for (const country of COUNTRIES) {
      for (const border of country.borders) {
        ctx.beginPath();
        let started = false;
        let prevSx = 0, prevSy = 0;
        for (const [lat, lon] of border) {
          const p = proj(lat, lon, radius, rot);
          const sx = cx + p.x, sy = cy - p.y;
          if (p.z > 0) {
            if (!started) {
              ctx.moveTo(sx, sy); started = true;
            } else {
              const dx = sx - prevSx, dy = sy - prevSy;
              if (dx * dx + dy * dy > maxSegDist2) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            prevSx = sx; prevSy = sy;
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }
    }

    // --- Grid ---
    ctx.strokeStyle = "rgba(52, 211, 153, 0.04)";
    ctx.lineWidth = 0.5;
    for (let glon = -180; glon < 180; glon += 30) {
      ctx.beginPath();
      let s = false;
      for (let glat = -90; glat <= 90; glat += 3) {
        const p = proj(glat, glon, radius, rot);
        if (p.z > 0) {
          if (!s) { ctx.moveTo(cx + p.x, cy - p.y); s = true; }
          else ctx.lineTo(cx + p.x, cy - p.y);
        } else s = false;
      }
      ctx.stroke();
    }
    for (let glat = -60; glat <= 60; glat += 30) {
      ctx.beginPath();
      let s = false;
      for (let glon = -180; glon <= 180; glon += 3) {
        const p = proj(glat, glon, radius, rot);
        if (p.z > 0) {
          if (!s) { ctx.moveTo(cx + p.x, cy - p.y); s = true; }
          else ctx.lineTo(cx + p.x, cy - p.y);
        } else s = false;
      }
      ctx.stroke();
    }

    // --- Country labels ---
    const majorNames = new Set([
      "Россия", "Канада", "Китай", "США", "Бразилия", "Австралия",
      "Индия", "Аргентина", "Казахстан", "Алжир", "ДР Конго",
      "Мексика", "Индонезия", "Египет", "Иран", "Монголия",
      "Перу", "Ливия", "Судан", "Франция", "Германия", "Испания",
      "Турция", "Украина", "Саудовская Аравия", "Пакистан", "ЮАР",
    ]);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (zoom >= 1.8) {
      const fs = Math.max(7, Math.min(11, zoom * 4.5));
      ctx.font = `${fs}px monospace`;
      for (const c of COUNTRIES) {
        const [lat, lon] = c.centroid;
        const p = proj(lat, lon, radius, rot);
        if (p.z <= radius * 0.15) continue;
        const a = Math.min(1, (p.z / radius) * 0.7);
        if (a < 0.15) continue;
        ctx.fillStyle = `rgba(130, 170, 155, ${a * 0.7})`;
        ctx.fillText(c.name, cx + p.x, cy - p.y);
      }
    } else {
      ctx.font = `${Math.max(8, 9 * zoom)}px monospace`;
      for (const c of COUNTRIES) {
        if (!majorNames.has(c.name)) continue;
        const [lat, lon] = c.centroid;
        const p = proj(lat, lon, radius, rot);
        if (p.z <= radius * 0.2) continue;
        const a = Math.min(1, (p.z / radius) * 0.6);
        ctx.fillStyle = `rgba(100, 145, 130, ${a * 0.55})`;
        ctx.fillText(c.name, cx + p.x, cy - p.y);
      }
    }

    ctx.restore();

    // Globe border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(52, 211, 153, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // --- Location points ---
    const projected: { id: string; sx: number; sy: number; visible: boolean }[] = [];

    for (const loc of filtered) {
      const p = proj(loc.coordX, loc.coordY, radius, rot);
      const sx = cx + p.x, sy = cy - p.y;
      const visible = p.z > 0;
      projected.push({ id: loc.id, sx, sy, visible });
      if (!visible) continue;

      const color = TYPE_COLORS[loc.type] ?? "#6b7280";
      const isSel = loc.id === selected;
      const depth = 0.4 + 0.6 * (p.z / radius);
      const dotR = (isSel ? 7 : 4) * Math.min(zoom, 2.5);

      // Glow
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, dotR * 4);
      glow.addColorStop(0, color + (isSel ? "60" : "25"));
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(sx - dotR * 4, sy - dotR * 4, dotR * 8, dotR * 8);

      // Pulse for special zones
      if (loc.type === "anomalyZone" || loc.type === "contaminationZone") {
        const phase = (Date.now() / 1000) % 3;
        const pr = dotR + phase * 5;
        const pa = Math.max(0, 0.4 - phase * 0.13);
        ctx.beginPath();
        ctx.arc(sx, sy, pr, 0, Math.PI * 2);
        ctx.strokeStyle = color + Math.round(pa * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Dot
      ctx.beginPath();
      ctx.arc(sx, sy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = depth;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Selection ring
      if (isSel) {
        ctx.beginPath();
        ctx.arc(sx, sy, dotR + 5, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Label
      const labelSz = Math.max(10, Math.min(14, zoom * 6));
      ctx.font = `bold ${isSel ? labelSz + 2 : labelSz}px monospace`;
      ctx.textAlign = "center";
      ctx.fillStyle = isSel ? color : `rgba(220, 230, 225, ${depth})`;
      ctx.fillText(loc.name, sx, sy - dotR - 8);

      if (zoom >= 1.5) {
        ctx.font = `${Math.max(8, zoom * 4)}px monospace`;
        ctx.fillStyle = `rgba(120, 140, 135, ${depth * 0.7})`;
        ctx.fillText(TYPE_LABELS[loc.type] ?? loc.type, sx, sy - dotR - 8 - labelSz);
      }
    }

    projectedRef.current = projected;

    // Auto-rotate
    if (autoRotateRef.current && !draggingRef.current) {
      rotRef.current.y += 0.002;
    }

    animRef.current = requestAnimationFrame(draw);
  }, [filtered, selected]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    autoRotateRef.current = false;
    targetRef.current = null;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    rotRef.current.y += dx * 0.005;
    rotRef.current.x += dy * 0.005;
    rotRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotRef.current.x));
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    if (!selected) {
      setTimeout(() => { autoRotateRef.current = true; }, 3000);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    targetRef.current = null;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    zoomRef.current = Math.max(0.5, Math.min(5, zoomRef.current * delta));
  };

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let closest: string | null = null;
    let closestDist = Infinity;
    const hitR = 20 * Math.min(zoomRef.current, 2);

    for (const p of projectedRef.current) {
      if (!p.visible) continue;
      const dist = Math.hypot(p.sx - mx, p.sy - my);
      if (dist < hitR && dist < closestDist) {
        closest = p.id;
        closestDist = dist;
      }
    }
    selectLocation(closest);
  };

  const touchRef = useRef<{ x: number; y: number; dist: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      draggingRef.current = true;
      autoRotateRef.current = false;
      targetRef.current = null;
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        dist: Math.hypot(dx, dy),
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && touchRef.current) {
      const dx = e.touches[0].clientX - touchRef.current.x;
      const dy = e.touches[0].clientY - touchRef.current.y;
      rotRef.current.y += dx * 0.005;
      rotRef.current.x += dy * 0.005;
      rotRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotRef.current.x));
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 };
    } else if (e.touches.length === 2 && touchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      if (touchRef.current.dist > 0) {
        zoomRef.current = Math.max(0.5, Math.min(5, zoomRef.current * (newDist / touchRef.current.dist)));
      }
      touchRef.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        dist: newDist,
      };
    }
  };

  const handleTouchEnd = () => {
    draggingRef.current = false;
    touchRef.current = null;
    if (!selected) setTimeout(() => { autoRotateRef.current = true; }, 3000);
  };

  const zoomIn = () => { targetRef.current = null; zoomRef.current = Math.min(5, zoomRef.current * 1.3); };
  const zoomOut = () => { targetRef.current = null; zoomRef.current = Math.max(0.5, zoomRef.current / 1.3); };
  const resetView = () => {
    targetRef.current = null;
    zoomRef.current = 1;
    setSelected(null);
    setTimeout(() => { autoRotateRef.current = true; }, 500);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">
      <div className="flex-1 border border-gray-800 rounded-lg bg-gray-950 relative overflow-hidden">
        <div className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap">
          {["all", "city", "base", "anomalyZone", "contaminationZone"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                filter === t
                  ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                  : "bg-gray-900 text-gray-500 border border-gray-800 hover:text-gray-300"
              }`}
            >
              {t === "all" ? "ВСЕ" : (TYPE_LABELS[t] ?? t).toUpperCase()}
            </button>
          ))}
        </div>

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          <button onClick={zoomIn} className="w-8 h-8 bg-gray-900/80 border border-gray-700 rounded text-gray-400 hover:text-emerald-400 hover:border-emerald-400/30 font-mono text-sm transition-colors">+</button>
          <button onClick={resetView} className="w-8 h-8 bg-gray-900/80 border border-gray-700 rounded text-gray-400 hover:text-emerald-400 hover:border-emerald-400/30 font-mono text-[10px] transition-colors">1:1</button>
          <button onClick={zoomOut} className="w-8 h-8 bg-gray-900/80 border border-gray-700 rounded text-gray-400 hover:text-emerald-400 hover:border-emerald-400/30 font-mono text-sm transition-colors">−</button>
        </div>

        <div className="absolute bottom-3 left-3 z-10 font-mono text-[10px] text-gray-700">
          Перетащите для вращения · Колёсико для масштаба
        </div>

        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      <div className="w-72 border border-gray-800 rounded-lg p-4 overflow-y-auto shrink-0">
        {selectedLoc ? (
          <div className="animate-fade-in">
            <h2 className="font-mono text-sm text-emerald-400 mb-1">{selectedLoc.name}</h2>
            <div className="font-mono text-[10px] text-gray-600 uppercase mb-3">
              {TYPE_LABELS[selectedLoc.type] ?? selectedLoc.type}
            </div>
            <AccessLevel level={selectedLoc.accessLevel} />

            <div className="mt-3">
              <div className="font-mono text-[10px] text-gray-600 mb-1">КООРДИНАТЫ</div>
              <div className="text-xs text-gray-400 font-mono">
                {selectedLoc.coordX.toFixed(2)}°, {selectedLoc.coordY.toFixed(2)}°
              </div>
            </div>

            {selectedLoc.population && (
              <div className="mt-3">
                <div className="font-mono text-[10px] text-gray-600 mb-1">НАСЕЛЕНИЕ</div>
                <div className="text-sm text-gray-300">{selectedLoc.population}</div>
              </div>
            )}

            {selectedLoc.description && (
              <div className="mt-3">
                <div className="font-mono text-[10px] text-gray-600 mb-1">ОПИСАНИЕ</div>
                <p className="text-xs text-gray-400">{selectedLoc.description}</p>
              </div>
            )}

            {selectedLoc.events.length > 0 && (
              <div className="mt-4">
                <div className="font-mono text-[10px] text-gray-600 mb-2">СОБЫТИЯ</div>
                <div className="space-y-1">
                  {selectedLoc.events.map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/events/${ev.id}`}
                      className="block text-xs font-mono text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      {ev.date ?? "████"} — {ev.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Link
                href={`/map/${selectedLoc.id}`}
                className="px-3 py-1.5 bg-gray-900 rounded font-mono text-xs text-emerald-400 hover:bg-gray-800 transition-colors"
              >
                ПОДРОБНЕЕ →
              </Link>
              <button
                onClick={resetView}
                className="px-3 py-1.5 bg-gray-900 rounded font-mono text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
              >
                СБРОС
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mt-8">
            <div className="text-gray-600 font-mono text-xs mb-2">
              Выберите объект на глобусе
            </div>
            <div className="space-y-2 mt-6">
              {filtered.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => selectLocation(loc.id)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-900 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: TYPE_COLORS[loc.type] ?? "#6b7280" }}
                    />
                    <span className="font-mono text-xs text-gray-400 group-hover:text-emerald-400">
                      {loc.name}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-gray-700 ml-4">
                    {TYPE_LABELS[loc.type] ?? loc.type}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

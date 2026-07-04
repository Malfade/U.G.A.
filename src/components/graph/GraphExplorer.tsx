"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import Link from "next/link";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface GraphNode {
  id: string;
  name: string;
  type: "character" | "organization" | "event";
  group: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  trustLevel: number;
  id: string;
}

const TYPE_COLORS: Record<string, string> = {
  character: "#34d399",
  organization: "#60a5fa",
  event: "#f59e0b",
};

const TYPE_LABELS: Record<string, string> = {
  character: "Персонаж",
  organization: "Организация",
  event: "Событие",
};

const GROUP_COLORS: Record<string, string> = {
  "Совет": "#60a5fa",
  "Красная Рука": "#f87171",
  "Повстанцы": "#fbbf24",
  "Мирные жители": "#34d399",
  "Заражённые": "#c084fc",
  "Нет фракции": "#6b7280",
  "Организация": "#60a5fa",
  "Событие": "#f59e0b",
};

function getNodeHref(node: GraphNode): string {
  if (node.type === "character") return `/characters/${node.id}`;
  if (node.type === "organization") return `/organizations/${node.id.replace("org-", "")}`;
  if (node.type === "event") return `/events/${node.id.replace("event-", "")}`;
  return "#";
}

export function GraphExplorer({
  nodes,
  links,
}: {
  nodes: GraphNode[];
  links: GraphLink[];
}) {
  const fgRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const hoveredRef = useRef<string | null>(null);

  const graphData = useMemo(() => ({ nodes, links }), [nodes, links]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedId) ?? null,
    [nodes, selectedId]
  );

  const selectedLinks = useMemo(() => {
    if (!selectedId) return [];
    return links.filter(
      (l) => l.source === selectedId || l.target === selectedId ||
             (l.source as any)?.id === selectedId || (l.target as any)?.id === selectedId // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  }, [links, selectedId]);

  const connectedNodes = useMemo(() => {
    if (!selectedId) return [];
    const ids = new Set<string>();
    for (const l of selectedLinks) {
      const sid = typeof l.source === "string" ? l.source : (l.source as any)?.id; // eslint-disable-line @typescript-eslint/no-explicit-any
      const tid = typeof l.target === "string" ? l.target : (l.target as any)?.id; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (sid && sid !== selectedId) ids.add(sid);
      if (tid && tid !== selectedId) ids.add(tid);
    }
    return nodes.filter((n) => ids.has(n.id));
  }, [nodes, selectedId, selectedLinks]);

  const handleNodeClick = useCallback(
    (node: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      setSelectedId(node.id);
      if (fgRef.current) {
        fgRef.current.centerAt(node.x, node.y, 600);
        fgRef.current.zoom(3, 600);
      }
    },
    []
  );

  const handleNodeHover = useCallback(
    (node: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      hoveredRef.current = node?.id ?? null;
    },
    []
  );

  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const n = node as GraphNode & { x: number; y: number };
      const fontSize = Math.max(3, 11 / globalScale);
      const isHovered = hoveredRef.current === n.id;
      const isSelected = selectedId === n.id;
      const color = GROUP_COLORS[n.group] ?? TYPE_COLORS[n.type] ?? "#6b7280";
      const baseR = n.type === "character" ? 5 : 3.5;
      const radius = baseR + (isHovered ? 1.5 : 0) + (isSelected ? 2 : 0);

      // Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.globalAlpha = isHovered || isSelected ? 1 : 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Selection/hover ring
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius + 4, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.globalAlpha = isSelected ? 0.4 : 0.15;
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Label
      ctx.font = `${isSelected ? "bold " : ""}${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = isSelected ? "#fff" : isHovered ? "#ddd" : "#777";
      ctx.fillText(n.name, n.x, n.y + radius + 2);
    },
    [selectedId] // hoveredRef doesn't trigger re-render
  );

  const linkColor = useCallback(
    (link: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!selectedId) return "#333";
      const sid = typeof link.source === "string" ? link.source : link.source?.id;
      const tid = typeof link.target === "string" ? link.target : link.target?.id;
      if (sid === selectedId || tid === selectedId) return "#34d399";
      return "#1a1a1a";
    },
    [selectedId]
  );

  const linkWidth = useCallback(
    (link: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const sid = typeof link.source === "string" ? link.source : link.source?.id;
      const tid = typeof link.target === "string" ? link.target : link.target?.id;
      const isActive = sid === selectedId || tid === selectedId;
      return isActive ? 2 : Math.max(0.5, (link as GraphLink).trustLevel / 40);
    },
    [selectedId]
  );

  const handleBgClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [graphDims, setGraphDims] = useState({ w: 600, h: 400 });

  useEffect(() => {
    const el = graphContainerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setGraphDims({
          w: Math.floor(entry.contentRect.width),
          h: Math.floor(entry.contentRect.height),
        });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="flex gap-4 h-[calc(100vh-200px)]">
      <div ref={graphContainerRef} className="flex-1 min-w-0 border border-gray-800 rounded-lg bg-gray-950 overflow-hidden relative">
        {graphDims.w > 0 && graphDims.h > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={graphDims.w}
            height={graphDims.h}
            graphData={graphData}
            nodeCanvasObject={nodeCanvasObject}
            nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => { // eslint-disable-line @typescript-eslint/no-explicit-any
              const r = node.type === "character" ? 8 : 6;
              ctx.beginPath();
              ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
            }}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            onBackgroundClick={handleBgClick}
            linkColor={linkColor}
            linkWidth={linkWidth}
            linkDirectionalParticles={1}
            linkDirectionalParticleWidth={1.5}
            linkDirectionalParticleSpeed={0.003}
            backgroundColor="#0a0a0a"
            cooldownTicks={100}
            enableZoomInteraction={true}
            minZoom={0.5}
            maxZoom={8}
          />
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex gap-3 bg-gray-950/80 px-3 py-2 rounded border border-gray-800">
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: TYPE_COLORS[type] }}
              />
              <span className="font-mono text-[10px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info sidebar */}
      <div className="w-72 border border-gray-800 rounded-lg p-4 overflow-y-auto shrink-0">
        {selectedNode ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: GROUP_COLORS[selectedNode.group] ?? TYPE_COLORS[selectedNode.type] }}
              />
              <h2 className="font-mono text-sm text-emerald-400">{selectedNode.name}</h2>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <div className="font-mono text-[10px] text-gray-600 tracking-widest">ТИП</div>
                <div className="text-xs text-gray-300">{TYPE_LABELS[selectedNode.type]}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-gray-600 tracking-widest">ГРУППА</div>
                <div className="text-xs text-gray-300">{selectedNode.group}</div>
              </div>
            </div>

            {selectedLinks.length > 0 && (
              <div className="mb-4">
                <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">
                  СВЯЗИ ({selectedLinks.length})
                </div>
                <div className="space-y-1.5">
                  {selectedLinks.map((link) => {
                    const sid = typeof link.source === "string" ? link.source : (link.source as any)?.id; // eslint-disable-line @typescript-eslint/no-explicit-any
                    const tid = typeof link.target === "string" ? link.target : (link.target as any)?.id; // eslint-disable-line @typescript-eslint/no-explicit-any
                    const otherId = sid === selectedId ? tid : sid;
                    const otherNode = nodes.find((n) => n.id === otherId);
                    return (
                      <div
                        key={link.id}
                        className="flex items-center justify-between px-2 py-1.5 rounded bg-gray-900/50 border border-gray-800"
                      >
                        <button
                          onClick={() => {
                            setSelectedId(otherId);
                            const fg = fgRef.current;
                            if (fg) {
                              const gn = (graphData.nodes as any[]).find((nd) => nd.id === otherId); // eslint-disable-line @typescript-eslint/no-explicit-any
                              if (gn?.x != null) { fg.centerAt(gn.x, gn.y, 600); }
                            }
                          }}
                          className="font-mono text-xs text-gray-300 hover:text-emerald-400 transition-colors text-left"
                        >
                          {otherNode?.name ?? otherId}
                        </button>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[9px] text-gray-600">{link.type}</span>
                          <span className="font-mono text-[9px] text-emerald-400/60">{link.trustLevel}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {connectedNodes.length > 0 && (
              <div className="mb-4">
                <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">
                  СВЯЗАННЫЕ УЗЛЫ ({connectedNodes.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {connectedNodes.map((cn) => (
                    <button
                      key={cn.id}
                      onClick={() => {
                        setSelectedId(cn.id);
                        const fg = fgRef.current;
                        if (fg) {
                          const gn = (graphData.nodes as any[]).find((nd) => nd.id === cn.id); // eslint-disable-line @typescript-eslint/no-explicit-any
                          if (gn?.x != null) { fg.centerAt(gn.x, gn.y, 600); }
                        }
                      }}
                      className="px-2 py-1 rounded text-[10px] font-mono border border-gray-800 text-gray-400 hover:text-emerald-400 hover:border-emerald-400/30 transition-colors"
                    >
                      {cn.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={getNodeHref(selectedNode)}
              className="inline-block mt-2 px-3 py-1.5 bg-gray-900 rounded font-mono text-xs text-emerald-400 hover:bg-gray-800 transition-colors"
            >
              ОТКРЫТЬ ДОСЬЕ →
            </Link>
          </div>
        ) : (
          <div className="text-center mt-8">
            <div className="text-gray-600 font-mono text-xs mb-2">
              Нажмите на узел для просмотра
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <div className="font-mono text-[10px] text-gray-600 tracking-widest mb-2">СТАТИСТИКА</div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-gray-900/50 rounded p-2 border border-gray-800">
                    <div className="font-mono text-lg text-emerald-400">{nodes.filter(n => n.type === "character").length}</div>
                    <div className="font-mono text-[9px] text-gray-600">ПЕРСОНАЖИ</div>
                  </div>
                  <div className="bg-gray-900/50 rounded p-2 border border-gray-800">
                    <div className="font-mono text-lg text-blue-400">{nodes.filter(n => n.type === "organization").length}</div>
                    <div className="font-mono text-[9px] text-gray-600">ОРГАНИЗАЦИИ</div>
                  </div>
                  <div className="bg-gray-900/50 rounded p-2 border border-gray-800">
                    <div className="font-mono text-lg text-amber-400">{nodes.filter(n => n.type === "event").length}</div>
                    <div className="font-mono text-[9px] text-gray-600">СОБЫТИЯ</div>
                  </div>
                  <div className="bg-gray-900/50 rounded p-2 border border-gray-800">
                    <div className="font-mono text-lg text-gray-400">{links.length}</div>
                    <div className="font-mono text-[9px] text-gray-600">СВЯЗИ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

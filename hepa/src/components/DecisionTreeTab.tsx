import React, { useState } from 'react';
import { DECISION_TREES } from '../data/decisionTrees';
import { DecisionNode } from '../types';
import {
  GitBranch,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Stethoscope,
  Info,
  ShieldAlert,
  Compass,
  FileCode,
  Copy,
  Check,
} from 'lucide-react';

export const DecisionTreeTab: React.FC = () => {
  const [selectedTreeId, setSelectedTreeId] = useState<string>('tree-transaminases');
  const [viewMode, setViewMode] = useState<'interactive' | 'mermaid'>('interactive');

  const currentTree = DECISION_TREES.find(t => t.id === selectedTreeId) || DECISION_TREES[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentTree.rootId);
  const [activePath, setActivePath] = useState<string[]>([currentTree.rootId]);
  const [copiedMermaid, setCopiedMermaid] = useState<boolean>(false);

  // Khi đổi cây, reset về node gốc
  const handleSelectTree = (treeId: string) => {
    setSelectedTreeId(treeId);
    const tree = DECISION_TREES.find(t => t.id === treeId) || DECISION_TREES[0];
    setSelectedNodeId(tree.rootId);
    setActivePath([tree.rootId]);
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    // Tính toán lộ trình từ root tới node này
    const path: string[] = [];
    let curr: string | undefined = nodeId;
    while (curr) {
      path.unshift(curr);
      const parentNode: DecisionNode | undefined = currentTree.nodes[curr];
      curr = parentNode?.parentId;
    }
    setActivePath(path);
  };

  const handleResetToRoot = () => {
    setSelectedNodeId(currentTree.rootId);
    setActivePath([currentTree.rootId]);
  };

  const handleCopyMermaid = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentTree.mermaidCode);
      setCopiedMermaid(true);
      setTimeout(() => setCopiedMermaid(false), 2000);
    }
  };

  const selectedNode = currentTree.nodes[selectedNodeId] || currentTree.nodes[currentTree.rootId];
  const childrenNodes = (selectedNode.childrenIds || [])
    .map(cid => currentTree.nodes[cid])
    .filter(Boolean);

  const getNodeBadgeClass = (category: string) => {
    switch (category) {
      case 'emergency':
        return 'bg-rose-600 text-white border-rose-700';
      case 'diagnosis':
        return 'bg-teal-600 text-white border-teal-700';
      case 'decision':
        return 'bg-amber-500 text-white border-amber-600';
      default:
        return 'bg-indigo-600 text-white border-indigo-700';
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header & Selector Cây Quyết Định */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Cây Quyết Định Lâm Sàng Tương Tác (Clinical Decision Trees)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Duyệt từng bước theo chuẩn ACG 2017 & AASLD để tiếp cận bất thường sinh hóa gan an toàn, không bỏ sót cấp cứu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Chọn cây */}
          <select
            value={selectedTreeId}
            onChange={e => handleSelectTree(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            {DECISION_TREES.map(tree => (
              <option key={tree.id} value={tree.id}>
                {tree.title}
              </option>
            ))}
          </select>

          {/* Toggle chế độ */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'interactive'
                  ? 'bg-white text-teal-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tương Tác Bước
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mermaid')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'mermaid'
                  ? 'bg-white text-teal-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mã Lưu Đồ
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'interactive' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Cột trái: Breadcrumb lộ trình & Các nhánh kế tiếp */}
          <div className="lg:col-span-5 space-y-4">
            {/* Breadcrumbs lộ trình */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-teal-600" />
                  <span>Lộ trình đang chọn ({activePath.length} bước)</span>
                </span>
                <button
                  type="button"
                  onClick={handleResetToRoot}
                  className="text-[11px] text-teal-700 hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Về gốc</span>
                </button>
              </div>

              <div className="space-y-1.5">
                {activePath.map((nodeId, idx) => {
                  const n = currentTree.nodes[nodeId];
                  if (!n) return null;
                  const isCurrent = nodeId === selectedNodeId;
                  return (
                    <div
                      key={nodeId}
                      onClick={() => handleSelectNode(nodeId)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                        isCurrent
                          ? 'bg-teal-50/80 border-teal-300 font-bold text-teal-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span className="truncate max-w-[200px]">{n.label}</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${getNodeBadgeClass(
                          n.category
                        )}`}
                      >
                        {n.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Các nhánh lựa chọn kế tiếp */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                {childrenNodes.length > 0
                  ? `Chọn nhánh tiếp theo (${childrenNodes.length} phương án):`
                  : 'Đã đến bước chẩn đoán / xử trí cuối cùng của nhánh này'}
              </span>

              {childrenNodes.length > 0 ? (
                <div className="space-y-2">
                  {childrenNodes.map(child => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => handleSelectNode(child.id)}
                      className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 transition group space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 group-hover:text-teal-900">
                          {child.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition group-hover:translate-x-0.5" />
                      </div>
                      {child.condition && (
                        <p className="text-[11px] text-teal-700 font-medium">
                          Điều kiện: {child.condition}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 line-clamp-2">{child.description}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Hoàn tất lộ trình cây quyết định. Hãy xem chi tiết y lệnh và bằng chứng ở bảng bên phải.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cột phải: Chi tiết Node hiện tại */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              {/* Tiêu đề Node */}
              <div className="border-b border-slate-100 pb-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getNodeBadgeClass(
                      selectedNode.category
                    )}`}
                  >
                    {selectedNode.category.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Tầng {selectedNode.level}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedNode.label}</h3>
                {selectedNode.condition && (
                  <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 font-medium flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Điều kiện kích hoạt: {selectedNode.condition}</span>
                  </div>
                )}
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {selectedNode.description}
                </p>
              </div>

              {/* Cảnh báo đặc biệt nếu có */}
              {selectedNode.warning && (
                <div className="p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl text-xs text-rose-950 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Cảnh báo khẩn:</span>
                    <span>{selectedNode.warning}</span>
                  </div>
                </div>
              )}

              {/* Bằng chứng & Cơ chế bệnh sinh */}
              {selectedNode.evidence && selectedNode.evidence.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Bằng Chứng & Cơ Chế Sinh Lý Bệnh:</span>
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {selectedNode.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Y lệnh khẩn & Hành động can thiệp */}
              {selectedNode.immediateOrders && selectedNode.immediateOrders.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                    <Stethoscope className="w-4 h-4 text-indigo-600" />
                    <span>Y Lệnh Lâm Sàng & Xét Nghiệm Cần Làm Ngay:</span>
                  </h4>
                  <div className="space-y-1.5 bg-indigo-50/50 p-3 rounded-xl border border-indigo-200 text-xs text-indigo-950">
                    {selectedNode.immediateOrders.map((ord, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="font-medium leading-relaxed">{ord}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ngọc lâm sàng (Clinical Pearls) */}
              {selectedNode.clinicalPearls && selectedNode.clinicalPearls.length > 0 && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-950">
                  <span className="font-bold flex items-center gap-1 text-amber-800 uppercase tracking-wide text-[11px]">
                    <span>💎</span>
                    <span>Ngọc Lâm Sàng (Clinical Pearls):</span>
                  </span>
                  {selectedNode.clinicalPearls.map((pearl, i) => (
                    <p key={i} className="leading-relaxed">
                      • {pearl}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Chế độ xem Mã sơ đồ Mermaid */
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Mã Lưu Đồ Mermaid: {currentTree.title}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyMermaid}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copiedMermaid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMermaid ? 'Đã sao chép' : 'Sao chép mã'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-teal-300 overflow-x-auto p-3 bg-slate-950 rounded-xl leading-relaxed whitespace-pre">
            {currentTree.mermaidCode}
          </pre>
        </div>
      )}
    </div>
  );
};

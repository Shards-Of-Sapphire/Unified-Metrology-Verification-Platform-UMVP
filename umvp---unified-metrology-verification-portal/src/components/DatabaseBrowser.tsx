import React, { useState, useEffect } from 'react';
import {
  Database,
  Table as TableIcon,
  Search,
  RefreshCw,
  Copy,
  Check,
  Eye,
  Code,
  Server,
  Layers,
  FileJson,
  X,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface TableColumn {
  name: string;
  dataTypeId?: number;
}

interface TableDataResponse {
  success: boolean;
  tableName: string;
  query: string;
  columns: TableColumn[];
  rowCount: number;
  rows: Record<string, any>[];
  source?: string;
  isStandbyFallback?: boolean;
  errorNotice?: string;
}

const AVAILABLE_TABLES = [
  { id: 'applications', label: 'applications', desc: 'Dossiers & Instruments', color: 'rose' },
  { id: 'certificates', label: 'certificates', desc: 'Digital Metrology Seals', color: 'emerald' },
  { id: 'audit_ledger', label: 'audit_ledger', desc: 'Cryptographic Trail', color: 'amber' },
  { id: 'users', label: 'users', desc: 'RBAC Identities', color: 'blue' },
  { id: 'e2ee_messages', label: 'e2ee_messages', desc: 'Encrypted Comms', color: 'purple' },
];

export const DatabaseBrowser: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('applications');
  const [tableData, setTableData] = useState<TableDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rowLimit, setRowLimit] = useState<number>(50);
  const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);

  useEffect(() => {
    fetchTableData(selectedTable, rowLimit);
  }, [selectedTable, rowLimit]);

  const fetchTableData = async (table: string, limit: number) => {
    setIsLoading(true);
    setSelectedRow(null);
    try {
      const res = await fetch(`/api/database/tables/${table}?limit=${limit}`);
      const data = await res.json();
      setTableData(data);
    } catch (err) {
      console.error('Failed to fetch table data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyQuery = () => {
    if (!tableData?.query) return;
    navigator.clipboard.writeText(tableData.query);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  // Filter rows based on search
  const filteredRows = (tableData?.rows || []).filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(row).some((val) => {
      if (val === null || val === undefined) return false;
      if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(q);
      return String(val).toLowerCase().includes(q);
    });
  });

  const columns = tableData?.columns || [];

  return (
    <div className="space-y-6">
      {/* Top Controls: Table Selector Pills & Query Details */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">Live PostgreSQL Table Browser</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono font-medium">
                {tableData?.source === 'CLOUD_SQL_POSTGRESQL' ? 'CLOUD SQL LIVE' : 'SYNCED REPOSITORY'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Directly query, inspect, and audit row records across all provisioned Cloud SQL tables.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTableData(selectedTable, rowLimit)}
              disabled={isLoading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Table Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {AVAILABLE_TABLES.map((tbl) => {
            const isSelected = selectedTable === tbl.id;
            return (
              <button
                key={tbl.id}
                onClick={() => setSelectedTable(tbl.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-sm font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="font-mono">{tbl.label}</span>
                <span className="text-[10px] opacity-60">({tbl.desc})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SQL Query Bar & Filters */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
        {/* SQL Command display */}
        <div className="flex items-center justify-between gap-3 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2 overflow-x-auto text-slate-300">
            <Code className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-emerald-400 font-bold">SQL:</span>
            <span className="text-slate-200">{tableData?.query || `SELECT * FROM ${selectedTable} LIMIT ${rowLimit};`}</span>
          </div>

          <button
            onClick={copyQuery}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-sans flex items-center gap-1.5 shrink-0 transition-colors"
            title="Copy SQL Query"
          >
            {copiedQuery ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedQuery ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Search & Limit filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search in ${selectedTable}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{filteredRows.length}</strong> of{' '}
              <strong className="text-white">{tableData?.rowCount || 0}</strong> rows
            </span>

            <div className="flex items-center gap-1">
              <span className="text-[11px]">Limit:</span>
              <select
                value={rowLimit}
                onChange={(e) => setRowLimit(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-rose-500 animate-spin" />
            <p className="text-xs text-slate-400">Querying Cloud SQL PostgreSQL table...</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-300">No matching records found</p>
            <p className="text-xs text-slate-500">
              {searchQuery ? `No rows matched "${searchQuery}".` : `The table "${selectedTable}" currently has 0 rows.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-950/80 sticky top-0 z-10 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">#</th>
                  {columns.map((col) => (
                    <th key={col.name} className="py-3 px-4 font-semibold whitespace-nowrap">
                      {col.name}
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredRows.map((row, idx) => (
                  <tr
                    key={row.id || row.block_index || row.blockIndex || idx}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedRow(row)}
                  >
                    <td className="py-2.5 px-3 text-center text-slate-500 text-[11px]">
                      {idx + 1}
                    </td>

                    {columns.map((col) => {
                      const val = row[col.name];
                      const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val ?? 'NULL');
                      const isIdOrHash =
                        col.name.includes('id') ||
                        col.name.includes('hash') ||
                        col.name.includes('signature') ||
                        col.name.includes('key');

                      return (
                        <td
                          key={col.name}
                          className="py-2.5 px-4 whitespace-nowrap max-w-xs truncate text-slate-300"
                        >
                          {val === null || val === undefined ? (
                            <span className="text-slate-600 italic">null</span>
                          ) : col.name === 'status' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {valStr}
                            </span>
                          ) : col.name === 'role' || col.name === 'actor_role' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {valStr}
                            </span>
                          ) : isIdOrHash && valStr.length > 16 ? (
                            <span
                              title={valStr}
                              className="text-slate-400 group-hover:text-white transition-colors"
                            >
                              {valStr.slice(0, 10)}...{valStr.slice(-6)}
                            </span>
                          ) : (
                            valStr
                          )}
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRow(row);
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-sans flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Inspector Modal */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-rose-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Record Inspector: {selectedTable}</h4>
                  <p className="text-[11px] text-slate-400">
                    ID: {selectedRow.id || selectedRow.block_index || selectedRow.blockIndex || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(selectedRow, null, 2), 'modal_json')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                >
                  {copiedField === 'modal_json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === 'modal_json' ? 'JSON Copied' : 'Copy JSON'}
                </button>
                <button
                  onClick={() => setSelectedRow(null)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Field Table & JSON preview */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Field Breakdown
                </span>
                <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-850 overflow-hidden text-xs">
                  {Object.entries(selectedRow).map(([key, val]) => (
                    <div key={key} className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2 hover:bg-slate-900/50">
                      <span className="font-mono text-slate-400 font-medium text-[11px] shrink-0 w-44">
                        {key}
                      </span>
                      <div className="flex-1 font-mono text-slate-200 text-xs break-all">
                        {val === null || val === undefined ? (
                          <span className="text-slate-600 italic">null</span>
                        ) : typeof val === 'object' ? (
                          <pre className="text-[11px] text-slate-300 bg-slate-900/70 p-2 rounded border border-slate-800 overflow-x-auto">
                            {JSON.stringify(val, null, 2)}
                          </pre>
                        ) : (
                          String(val)
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(String(val), key)}
                        className="text-slate-500 hover:text-white shrink-0 p-1"
                        title="Copy value"
                      >
                        {copiedField === key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

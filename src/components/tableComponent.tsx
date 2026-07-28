import React, { useMemo, useState } from "react";
import { AgGridReact, AgGridProvider } from "ag-grid-react";
import type { ColDef, GridOptions, SelectionChangedEvent} from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export interface TableComponentProps<T = any> {
  rowData: T[] | null | undefined;
  columnDefs: ColDef<T>[];
  defaultColDef?: ColDef<T>;
  title?: string;
  description?: string;
  pagination?: boolean;
  paginationPageSize?: number;
  paginationPageSizeSelector?: number[];
  loading?: boolean;
  height?: string | number;
  quickFilterText?: string;
  themeClass?: string;
  gridOptions?: GridOptions<T>;
  onRowClick?: (event: any) => void;
  onSelectionChanged?: (selectedRows: T[]) => void;
  showSearchBar?: boolean;
}

export function TableComponent<T = any>({
  rowData,
  columnDefs,
  defaultColDef,
  title,
  description,
  pagination = true,
  paginationPageSize = 10,
  paginationPageSizeSelector = [5, 10, 20, 50],
  loading = false,
  height = "500px",
  quickFilterText: externalQuickFilter,
  themeClass = "ag-theme-quartz",
  gridOptions,
  onRowClick,
  onSelectionChanged,
  showSearchBar = true,
}: TableComponentProps<T>) {
  const [internalQuickFilter, setInternalQuickFilter] = useState("");
  const [pageSize, setPageSize] = useState(paginationPageSize);
  const modules = [AllCommunityModule];

  // Default Column Definitions
  const mergedDefaultColDef = useMemo<ColDef<T>>(() => {
    return {
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: false,
      flex: 1,
      minWidth: 100,
      ...defaultColDef,
    };
  }, [defaultColDef]);

  // Handle grid selection change events
  const handleSelectionChanged = (event: SelectionChangedEvent<T>) => {
    if (onSelectionChanged) {
      const selectedNodes = event.api.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data).filter((data): data is T => !!data);
      onSelectionChanged(selectedData);
    }
  };

  // Determine active search filter term
  const activeQuickFilter = externalQuickFilter !== undefined ? externalQuickFilter : internalQuickFilter;

  // Auto-size columns to fit width
  const autoSizeStrategy = useMemo<any>(() => {
    return {
      type: "fitGridWidth",
      defaultMinWidth: 100,
    };
  }, []);

  return (
    <div className="flex w-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Custom AG-Grid Styled overrides to inject premium visuals */}
      <style>{`
        .ag-theme-quartz {
          --ag-font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          --ag-active-color: #3b41e3;
          --ag-selected-row-background-color: rgba(59, 65, 227, 0.05);
          --ag-row-hover-color: rgba(59, 65, 227, 0.015);
          --ag-header-background-color: #f8fafc;
          --ag-header-foreground-color: #475569;
          --ag-border-color: #e2e8f0;
          --ag-font-size: 14px;
          --ag-grid-size: 6px;
          --ag-list-item-height: 38px;
          --ag-row-height: 60px;
          --ag-header-height: 52px;
          border-radius: 16px;
        }
        .ag-theme-quartz .ag-header-cell-label {
          font-weight: 700 !important;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: #475569;
        }
        .ag-theme-quartz .ag-row {
          border-bottom: 1px solid #f1f5f9 !important;
          transition: background-color 0.2s ease;
        }
        .ag-theme-quartz .ag-row-selected {
          border-left: 3px solid #3b41e3 !important;
        }
        .ag-theme-quartz .ag-cell {
          display: flex;
          align-items: center;
          border: none !important;
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
        .ag-theme-quartz .ag-root-wrapper {
          border: none !important;
          border-radius: 16px;
        }
        .ag-theme-quartz .ag-paging-panel {
          border-top: 1px solid #e2e8f0 !important;
          color: #64748b;
          font-weight: 500;
          font-size: 12px;
        }
      `}</style>

      {/* Table Header Area */}
      {(title || description || (showSearchBar && externalQuickFilter === undefined)) && (
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between bg-slate-50/50">
          <div>
            {title && (
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
                {rowData && rowData.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200/60">
                    {rowData.length} parsed
                  </span>
                )}
              </div>
            )}
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Built-in Premium Search Bar */}
            {showSearchBar && externalQuickFilter === undefined && (
              <div className="relative min-w-[280px] flex-1 sm:flex-none">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <svg
                    className="h-4.5 w-4.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={internalQuickFilter}
                  onChange={(e) => setInternalQuickFilter(e.target.value)}
                  placeholder="Search candidate or score..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-[#3b41e3] focus:ring-4 focus:ring-[#3b41e3]/10 shadow-sm"
                />
              </div>
            )}

            {/* Page Size Selector */}
            {pagination && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-[#3b41e3] focus:ring-4 focus:ring-[#3b41e3]/10 shadow-sm cursor-pointer"
                >
                  {paginationPageSizeSelector.map((size) => (
                    <option key={size} value={size}>
                      {size} rows
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className="relative w-full" style={{ height }}>
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-md">
              <svg
                className="h-5 w-5 animate-spin text-[#3b41e3]"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm font-bold text-slate-700">Loading history records...</span>
            </div>
          </div>
        )}

        {/* AG Grid */}
        <AgGridProvider modules={modules}>
        <div className={`${themeClass} w-full h-full`}>
          <AgGridReact
            rowData={rowData || []}
            columnDefs={columnDefs}
            defaultColDef={{
  ...mergedDefaultColDef,
  tooltipComponent: "customTooltip", // optional custom styled tooltip
}}
            pagination={pagination}
            paginationPageSize={pageSize}
            quickFilterText={activeQuickFilter}
            onRowClicked={onRowClick}
            onSelectionChanged={handleSelectionChanged}
            autoSizeStrategy={autoSizeStrategy}
            suppressCellFocus={true}
            overlayLoadingTemplate={
              '<span class="ag-overlay-loading-center text-slate-500 font-semibold">Please wait while we load your history database</span>'
            }
            overlayNoRowsTemplate={
              '<span class="ag-overlay-no-rows-center text-slate-500 font-semibold">No parsed resumes found in history</span>'
            }
            {...gridOptions}
          />
        </div>
         </AgGridProvider>
      </div>
    </div>
  );
}

export default TableComponent;

import React, { useState, useMemo, MouseEvent } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AppContextMenu, { ContextMenuItemConfig } from '../Navigation/AppContextMenu';

export interface TableColumn {
  key: string;
  header: string;
}

export interface AppDataTableProps {
  columns?: TableColumn[];
  headers?: string[];
  data?: Record<string, any>[];
  selectedRowId?: string | number | Record<string, any> | null;
  selectedIndex?: number | null;
  onSelectRow?: (rowOrIndex: any) => void;
  onSortChange?: (fieldKey: string) => void;
  onRowAction?: (action: 'post' | 'cancel' | 'insert' | 'delete', row: any) => void;
}

interface MenuState {
  isOpen: boolean;
  x: number;
  y: number;
  activeRow: Record<string, any> | null;
}

export const AppDataTable: React.FC<AppDataTableProps> = ({
  columns = [],
  headers = [],
  data = [],
  selectedRowId,
  selectedIndex,
  onSelectRow,
  onSortChange,
  onRowAction,
}) => {
  const { theme } = useTheme();
  const isWindows = theme === 'windows';

  const [menuState, setMenuState] = useState<MenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    activeRow: null,
  });
  const [currentSort, setCurrentSort] = useState<string>('unsorted');

  // Normalize column configurations for backward compatibility
  const effectiveColumns = useMemo<TableColumn[]>(() => {
    if (columns && columns.length > 0) return columns;
    if (headers && headers.length > 0) {
      const keyMap: Record<string, string> = {
        'Type': 'type',
        'Notes': 'notes',
        'Date Added': 'date',
        'By': 'by',
      };
      return headers.map((h) => ({
        key: keyMap[h] || h.toLowerCase().replace(/\s+/g, ''),
        header: h,
      }));
    }
    return [];
  }, [columns, headers]);

  const handleRowContextMenu = (e: MouseEvent<HTMLTableRowElement>, row: Record<string, any>, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (onSelectRow) {
      onSelectRow(row?.id !== undefined ? row : index);
    }

    setMenuState({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      activeRow: row,
    });
  };

  const contextMenuItems: ContextMenuItemConfig[] = [
    {
      id: 'sort_by',
      label: 'Sort by',
      submenu: [
        {
          id: 'unsorted',
          label: '<unsorted>',
          checked: currentSort === 'unsorted',
          onClick: () => {
            setCurrentSort('unsorted');
            onSortChange?.('unsorted');
          },
        },
        ...effectiveColumns.map((col) => ({
          id: col.key,
          label: col.header,
          checked: currentSort === col.key,
          onClick: () => {
            setCurrentSort(col.key);
            onSortChange?.(col.key);
          },
        })),
      ],
    },
    { type: 'separator' },
    {
      id: 'post_changes',
      label: 'Post changes to current row',
      onClick: () => onRowAction?.('post', menuState.activeRow),
    },
    {
      id: 'cancel_changes',
      label: 'Cancel changes to current row',
      onClick: () => onRowAction?.('cancel', menuState.activeRow),
    },
    {
      id: 'insert_row',
      label: 'Insert new row',
      onClick: () => onRowAction?.('insert', menuState.activeRow),
    },
    {
      id: 'delete_row',
      label: 'Delete current row',
      onClick: () => onRowAction?.('delete', menuState.activeRow),
    },
  ];

  return (
    <div className="bg-white border-1 border-t-[#7F9DB9] border-l-[#7F9DB9] border-b-white border-r-white overflow-auto max-h-[160px] h-36">
      <table
        className={`w-full text-left border-collapse ${
          isWindows
            ? 'bg-white text-xs font-sans border-1 border-[#808080]'
            : 'bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200'
        }`}
      >
        <thead>
          <tr
            className={
              isWindows
                ? 'bg-[#F0EEEF] text-black border-b-2 border-[#808080]'
                : 'bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700'
            }
          >
            {effectiveColumns.map((col) => (
              <th
                key={col.key}
                className={`p-[2px] font-semibold ${
                  isWindows
                    ? 'border-r border-[#808080] shadow-[inset_1px_1px_0px_#ffffff]'
                    : ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            const rowId = row.id ?? index;
            const isSelected =
              selectedRowId !== undefined && selectedRowId !== null
                ? selectedRowId === row.id || selectedRowId === row
                : selectedIndex === index;

            return (
              <tr
                key={rowId}
                onClick={() => onSelectRow && onSelectRow(row.id ? row : index)}
                onContextMenu={(e) => handleRowContextMenu(e, row, index)}
                className={`cursor-pointer ${
                  isWindows
                    ? isSelected
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-black'
                    : isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {effectiveColumns.map((col) => (
                  <td
                    key={col.key}
                    className={`p-[2px] whitespace-nowrap ${
                      isWindows ? 'border-r border-b border-[#e0e0e0]' : ''
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <AppContextMenu
        x={menuState.x}
        y={menuState.y}
        isOpen={menuState.isOpen}
        onClose={() => setMenuState((prev) => ({ ...prev, isOpen: false }))}
        items={contextMenuItems}
      />
    </div>
  );
};

export default AppDataTable;
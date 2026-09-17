import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext';

export interface ContextMenuItemConfig {
  id?: string;
  label?: string;
  type?: 'item' | 'separator';
  checked?: boolean;
  disabled?: boolean;
  onClick?: (item: ContextMenuItemConfig) => void;
  submenu?: ContextMenuItemConfig[];
}

export interface AppContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  items?: ContextMenuItemConfig[];
}

interface ContextMenuItemProps {
  item: ContextMenuItemConfig;
  isWindows: boolean;
  onClose: () => void;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ item, isWindows, onClose }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const hasSubmenu = Boolean(item.submenu && item.submenu.length > 0);

  const handleItemClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (item.disabled || hasSubmenu) return;
    if (item.onClick) item.onClick(item);
    if (onClose) onClose();
  };

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={() => hasSubmenu && setIsSubmenuOpen(true)}
      onMouseLeave={() => hasSubmenu && setIsSubmenuOpen(false)}
    >
      <button
        type="button"
        disabled={item.disabled}
        onClick={handleItemClick}
        className={`w-full text-left flex items-center justify-between select-none ${
          isWindows
            ? `px-2 py-[2px] text-xs font-sans ${
                item.disabled
                  ? 'text-gray-400 cursor-default'
                  : 'text-black hover:bg-blue-600 hover:text-white cursor-pointer'
              }`
            : `px-3 py-1.5 text-sm rounded-md transition-colors ${
                item.disabled
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white cursor-pointer'
              }`
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-3 inline-block text-center font-bold">
            {item.checked ? '✓' : ''}
          </span>
          <span>{item.label}</span>
        </span>

        {hasSubmenu && (
          <span className="ml-3 text-[9px]">{isWindows ? '▶' : '▸'}</span>
        )}
      </button>

      {/* Submenu Dropdown */}
      {hasSubmenu && isSubmenuOpen && item.submenu && (
        <div
          className={`absolute top-0 left-full ${
            isWindows
              ? 'bg-[#F0EEEF] border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] shadow-[2px_2px_0px_rgba(0,0,0,0.5)] py-0.5 min-w-[150px]'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg p-1 min-w-[160px]'
          }`}
        >
          {item.submenu.map((subItem, index) => (
            <ContextMenuItem
              key={subItem.id || index}
              item={subItem}
              isWindows={isWindows}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const AppContextMenu: React.FC<AppContextMenuProps> = ({ x, y, isOpen, onClose, items = [] }) => {
  const { theme } = useTheme();
  const isWindows = theme === 'windows';
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent | Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{ top: `${y}px`, left: `${x}px` }}
      className={`fixed z-[9999] ${
        isWindows
          ? 'bg-[#F0EEEF] border-2 border-t-white border-l-white border-r-[#404040] border-b-[#404040] shadow-[2px_2px_0px_rgba(0,0,0,0.5)] py-0.5 min-w-[180px]'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg p-1 min-w-[190px]'
      }`}
    >
      {items.map((item, index) =>
        item.type === 'separator' ? (
          <div
            key={index}
            className={
              isWindows
                ? 'my-1 border-t border-[#808080] border-b border-white'
                : 'my-1 border-t border-slate-200 dark:border-slate-700'
            }
          />
        ) : (
          <ContextMenuItem
            key={item.id || index}
            item={item}
            isWindows={isWindows}
            onClose={onClose}
          />
        )
      )}
    </div>,
    document.body
  );
};

export default AppContextMenu;
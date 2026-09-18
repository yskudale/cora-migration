import { TBD_ITEMS } from '../data/mockData';
import { HelpCircleIcon, ShieldIcon, LockIcon, LayersIcon } from './Icons';
import type { TBDItem } from '../types';

const categoryConfig: Record<TBDItem['category'], { icon: typeof ShieldIcon; color: string; label: string }> = {
  architecture: { icon: ShieldIcon, color: 'primary', label: 'Architecture Decision' },
  business: { icon: HelpCircleIcon, color: 'warning', label: 'Business Confirmation' },
  compliance: { icon: LockIcon, color: 'error', label: 'Compliance' },
  scope: { icon: LayersIcon, color: 'neutral', label: 'Scope Decision' },
};

export function OpenDecisionsPanel() {
  const grouped = TBD_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<TBDItem['category'], TBDItem[]>);

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Open Decisions / TBD Items</h2>
        <p className="text-sm text-neutral-500">
          Unresolved items from the PRD validation review. These must NOT be treated as approved functionality.
          Each item requires confirmation from the business, architecture, or compliance team.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning-200 bg-warning-50 px-4 py-3">
        <HelpCircleIcon size={20} className="mt-0.5 shrink-0 text-warning-600" />
        <div>
          <p className="text-sm font-medium text-warning-800">Prototype Only — Not for Production</p>
          <p className="text-xs text-warning-700 mt-0.5">
            This prototype is a UX validation artifact. All items below are unresolved and must be
            confirmed before implementation. The prototype uses mock data and does not make real API calls.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {(Object.keys(grouped) as TBDItem['category'][]).map((cat) => {
          const items = grouped[cat];
          const config = categoryConfig[cat];
          const Icon = config.icon;

          return (
            <div key={cat} className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <Icon size={18} className={`text-${config.color}-600`} />
                  <h3 className="text-sm font-semibold text-neutral-700">{config.label}</h3>
                  <span className="badge-neutral">{items.length}</span>
                </div>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg border border-neutral-200 px-4 py-3"
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-${config.color}-100`}>
                        <Icon size={16} className={`text-${config.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-neutral-700">{item.label}</p>
                          <span className="tbd-badge">TBD</span>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">{item.description}</p>
                        <p className="mt-1 text-xs text-neutral-400">
                          Source: {item.source}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 card">
        <div className="card-header">
          <h3 className="text-sm font-semibold text-neutral-700">Architecture Rules Enforced in Prototype</h3>
        </div>
        <div className="card-body">
          <div className="space-y-2 text-xs text-neutral-600">
            <p>• No real API calls — all data is mocked via the service layer</p>
            <p>• No database access — no schema details exposed in the UI</p>
            <p>• No authentication implementation — auth mechanism is TBD</p>
            <p>• No ERNO allocation logic in the frontend</p>
            <p>• No physical file paths (ERFILEPATH) shown in the UI</p>
            <p>• No internal error codes shown to end users</p>
            <p>• No real scanner hardware interaction — Dynamsoft is simulated</p>
            <p>• All TBD items are visibly marked — none are silently resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

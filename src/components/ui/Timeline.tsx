import type { TimelineEvent } from '../../types';
import { CheckCircle, Clock, AlertCircle, XCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_ICON: Record<string, React.ReactNode> = {
  submitted: <FileText size={14} />,
  under_review: <Clock size={14} />,
  documents_required: <AlertCircle size={14} />,
  inspection_scheduled: <Clock size={14} />,
  inspection_in_progress: <Clock size={14} />,
  testing_assigned: <Clock size={14} />,
  testing_in_progress: <Clock size={14} />,
  result_pending: <Clock size={14} />,
  approved: <CheckCircle size={14} />,
  rejected: <XCircle size={14} />,
  certificate_issued: <CheckCircle size={14} />,
};

const STATUS_COLOR: Record<string, string> = {
  submitted: 'bg-blue-500',
  under_review: 'bg-violet-500',
  documents_required: 'bg-orange-500',
  inspection_scheduled: 'bg-amber-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  certificate_issued: 'bg-teal-500',
};

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
      <div className="space-y-5">
        {events.map((event, i) => {
          const color = STATUS_COLOR[event.status] || 'bg-slate-400';
          const icon = STATUS_ICON[event.status] || <Clock size={14} />;
          const isLast = i === events.length - 1;
          return (
            <div key={event.id} className="flex gap-4 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 z-10 ${color} shadow-sm`}>
                {icon}
              </div>
              <div className={`flex-1 pb-4 ${!isLast ? 'border-b border-slate-100' : ''}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{event.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400">
                      {format(new Date(event.timestamp), 'dd MMM yyyy')}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {format(new Date(event.timestamp), 'h:mm a')}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">by {event.actor}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

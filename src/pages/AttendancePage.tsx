import { Panel } from '@/components/ui/Panel';
import { useCashierStore } from '@/store/useCashierStore';

export default function AttendancePage() {
  const { employees, clockToggle } = useCashierStore();

  return (
    <Panel title="Absensi" subtitle="Tabel staf, peran, jam masuk, jam keluar, dan tombol clock in atau clock out.">
      <div className="space-y-3">
        {employees.map((employee) => (
          <div key={employee.id} className="brand-soft-card flex flex-col gap-4 rounded-3xl p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1535D4] font-semibold text-white">
                {employee.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-white">{employee.name}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-slate-400">{employee.role}</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3 lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Jam masuk</p>
                <p className="mt-1 text-white">{employee.in ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Jam keluar</p>
                <p className="mt-1 text-white">{employee.out ?? '-'}</p>
              </div>
              <button type="button" onClick={() => clockToggle(employee.id)} className={`rounded-2xl px-4 py-3 text-sm font-medium ${employee.present ? 'brand-secondary-btn' : 'brand-primary-btn'}`}>
                {employee.present ? 'Clock Out' : 'Clock In'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

import { useEffect } from 'react';
import { X, BookOpen, ShieldAlert, Repeat2, Layers, Activity, Zap, TrendingDown, Clock, GitBranch, FlameKindling, Target, AlertTriangle, Info, Sliders } from 'lucide-react';

interface StrategyBlueprintModalProps {
  open: boolean;
  onClose: () => void;
  strategyName?: string;
  strategyVersion?: string;
  botState?: Record<string, any>;
}

export function StrategyBlueprintModal({
  open,
  onClose,
  strategyName = 'NostalgiaForInfinityX8',
  strategyVersion = 'v18.0.124',
  botState = {},
}: StrategyBlueprintModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const dryRun = botState.dry_run ?? true;
  const maxTrades = botState.max_open_trades ?? 6;
  const timeframe = botState.timeframe || '5m';
  const stakeCur = botState.stake_currency || 'USDT';
  const tradingMode = botState.trading_mode || 'futures';
  const marginMode = botState.margin_mode || 'isolated';
  const positionAdjust = botState.position_adjustment_enable ?? true;
  const grinding = botState.grinding_enable ?? true;
  const derisk = botState.derisk_enable ?? true;
  const leverage = botState.futures_mode_leverage ?? 3.0;
  const leverageRebuy = botState.futures_mode_leverage_rebuy_mode ?? 3.0;
  const leverageGrind = botState.futures_mode_leverage_grind_mode ?? 3.0;
  const freqVersion = botState.version || 'freqtrade';
  const startupCandles = botState.startup_candle_count ?? 800;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-slate-700/60 bg-gradient-to-b from-[#0f1729] via-[#0c1322] to-[#0a1020] text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-5 sm:px-7 pt-5 pb-4 border-b border-slate-700/40">
          <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.18),_transparent_55%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-emerald-400/80 font-bold mb-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Strategy Blueprint</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">
                {strategyName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-semibold">
                  <GitBranch className="w-3 h-3" />
                  {strategyVersion}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50 text-[11px] font-mono">
                  <Clock className="w-3 h-3" />
                  {timeframe} · {startupCandles} startup
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${
                  dryRun
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  <Activity className="w-3 h-3" />
                  {dryRun ? 'Simulation' : 'Live'} · {tradingMode}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto max-h-[calc(90vh-130px)] px-5 sm:px-7 py-5 space-y-6 text-[13px] leading-relaxed">
          {/* Intro */}
          <section>
            <p className="text-slate-300">
              <b className="text-white">{strategyName}</b> adalah strategi frekuensi tinggi–toleransi tinggi
              yang membaca beberapa timeframe sekaligus (5m/15m/1h/4h/1d) dan hanya masuk posisi ketika
              {' '}<span className="text-emerald-300 font-semibold">mayoritas timeframe sepakat</span>{' '}
              bahwa harga sudah cukup murah (long) atau cukup mahal (short). Setelah entry, strategi
              mengelola posisi lewat tiga protokol khusus: <b>rebuy</b>, <b>derisk</b>, dan <b>grinding</b>
              — yang akan kita bahas detail di bawah.
            </p>
          </section>

          {/* Runtime stats */}
          <section>
            <SectionHeader icon={<Sliders className="w-4 h-4 text-slate-400" />} title="Konfigurasi runtime" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
              <Stat label="Slot terbuka" value={`${maxTrades}`} sub="maks posisi paralel" />
              <Stat label="Stake" value={stakeCur} sub={dryRun ? 'paper' : 'real'} />
              <Stat label="Leverage normal" value={`${leverage}x`} sub={`mode ${marginMode}`} />
              <Stat label="Leverage rebuy/grind" value={`${leverageRebuy}/${leverageGrind}x`} sub="isolated" />
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Feature
                active={positionAdjust}
                icon={<Layers className="w-3.5 h-3.5" />}
                title="Position adjustment"
                desc="Tanpa flag ini, semua protokol rebuy/derisk/grind nonaktif. Bot hanya bisa entry & exit utuh."
              />
              <Feature
                active={grinding}
                icon={<Repeat2 className="w-3.5 h-3.5" />}
                title="Grinding"
                desc="Membolehkan v1 dan v2 grinding. v2 mendukung 6 round + 3 level derisk dengan stake progresif."
              />
              <Feature
                active={derisk}
                icon={<ShieldAlert className="w-3.5 h-3.5" />}
                title="Derisk"
                desc="Saat floating minus membesar, bot menjual sebagian posisi untuk memotong kerugian."
              />
            </div>
          </section>

          {/* Entry modes */}
          <section>
            <SectionHeader icon={<Zap className="w-4 h-4 text-amber-400" />} title="Mode entry" />
            <p className="text-slate-400 mb-2">
              Ada <b className="text-white">9 mode long</b> dan <b className="text-white">9 mode short</b>,
              masing-masing punya syarat indikator berbeda dan rentang market tertentu. Tag di belakang nama
              mode adalah awalan untuk nomor urut sinyal.
            </p>
            <ModeTable
              side="Long"
              rows={[
                { tag: '1–13', mode: 'normal', desc: 'Setup standar, paling sering.' },
                { tag: '21–26', mode: 'pump', desc: 'Mengikuti momentum naik tiba-tiba.' },
                { tag: '41–53', mode: 'quick', desc: 'Entry cepat saat trend baru terbentuk.' },
                { tag: '61–68', mode: 'rebuy', desc: 'Mode rebuy murni (5 step).' },
                { tag: '81–82', mode: 'hp', desc: 'High-profit mode, ekspektasi payoff besar.' },
                { tag: '101–110', mode: 'rapid', desc: 'Entry cepat setelah flash crash.' },
                { tag: '120', mode: 'grind', desc: 'Entry khusus grinding.' },
                { tag: '121', mode: 'btc', desc: 'Mode khusus saat BTC sedang pumping.' },
                { tag: '141–145', mode: 'tc', desc: 'Top coins mode (koin likuiditas tinggi).' },
                { tag: '161–173', mode: 'scalp', desc: 'Scalping ketat, target kecil.' },
              ]}
            />
          </section>

          {/* Rebuy protocol */}
          <section>
            <SectionHeader icon={<Repeat2 className="w-4 h-4 text-cyan-400" />} title="Protokol rebuy (rata-rata bertahap)" />
            <p className="text-slate-300">
              Saat harga berlawanan, strategi menambah entry dengan ukuran mengecil menggunakan rasio{' '}
              <b className="font-mono text-cyan-300">[0.10, 0.10, 0.10]</b> dari modal awal. Setiap step
              rebuy menunggu floating minus melewati ambang{' '}
              <b className="font-mono text-cyan-300">[-0.12, -0.14, -0.16]</b> (futures).
              Tujuannya: turunkan harga rata-rata sehingga titik balik tinggal sedikit lagi.
            </p>
            <ul className="mt-2 space-y-1 text-slate-300 text-[12.5px]">
              <li>• Syarat slot: butuh minimal <b className="text-white">2 slot kosong</b> agar rebuy mode aktif.</li>
              <li>• Batas rugi rebuy: <b className="font-mono text-rose-300">-1.0</b> (100% dari entry pertama).</li>
              <li>• Exit khusus rebuy: <b className="font-mono text-emerald-300">exit_long_rebuy_e_r</b> dan variasinya.</li>
            </ul>
          </section>

          {/* Derisk protocol */}
          <section>
            <SectionHeader icon={<ShieldAlert className="w-4 h-4 text-rose-400" />} title="Protokol derisk (potong rugi)" />
            <p className="text-slate-300">
              Derisk menjual sebagian posisi ketika floating minus sudah melewati ambang batas, sehingga
              sisa modal yang masih hidup punya ruang untuk menunggu pulih tanpa terlikuidasi.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <DeriskCard
                level="Level 1"
                range="(-0.18, -0.35)"
                stake="20% modal"
                desc="Potong risiko pertama."
              />
              <DeriskCard
                level="Level 2"
                range="(-0.16, -0.54)"
                stake="30% modal"
                desc="Saat level 1 belum cukup."
              />
              <DeriskCard
                level="Level 3"
                range="(-0.30, -0.60)"
                stake="50% modal"
                desc="Potong agresif menyelamatkan sisa modal."
              />
            </div>
            <p className="text-slate-400 mt-2 text-[12px]">
              Derisk mode reguler menggunakan ambang{' '}
              <b className="font-mono text-rose-300">-0.60</b> (futures), dengan target reentry{' '}
              <b className="font-mono text-rose-300">-0.08</b> untuk menambah lagi di harga lebih murah.
            </p>
          </section>

          {/* Grinding protocol */}
          <section>
            <SectionHeader icon={<FlameKindling className="w-4 h-4 text-orange-400" />} title="Protokol grinding" />
            <p className="text-slate-300">
              Grinding v1 mendukung <b>6 sub-grind</b> dengan stake progresif dan target profit berbeda.
              Grinding v2 menambahkan lapisan derisk per round, stake lebih besar, dan toleransi rugi
              lebih dalam.
            </p>

            <h4 className="text-[12px] uppercase tracking-wider text-slate-300 font-bold mt-3 mb-1.5">Grinding v1 (stakes vs thresholds futures)</h4>
            <div className="overflow-x-auto rounded-lg border border-slate-700/50">
              <table className="w-full text-[11.5px] font-mono">
                <thead className="bg-slate-800/60 text-slate-400">
                  <tr>
                    <th className="px-2 py-1.5 text-left">Round</th>
                    <th className="px-2 py-1.5 text-left">Stakes (% entry pertama)</th>
                    <th className="px-2 py-1.5 text-left">Sub-thresholds</th>
                    <th className="px-2 py-1.5 text-left">Profit target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  <tr><td className="px-2 py-1">grind_1</td><td className="px-2 py-1 text-cyan-300">0.20 / 0.22 / 0.24</td><td className="px-2 py-1">-0.12 / -0.16 / -0.20</td><td className="px-2 py-1 text-emerald-300">+1.8%</td></tr>
                  <tr><td className="px-2 py-1">grind_2</td><td className="px-2 py-1 text-cyan-300">0.20 / 0.22 / 0.24</td><td className="px-2 py-1">-0.12 / -0.16 / -0.20</td><td className="px-2 py-1 text-emerald-300">+1.8%</td></tr>
                  <tr><td className="px-2 py-1">grind_3</td><td className="px-2 py-1 text-cyan-300">0.20 / 0.22 / 0.24</td><td className="px-2 py-1">-0.12 / -0.16 / -0.20</td><td className="px-2 py-1 text-emerald-300">+1.8%</td></tr>
                  <tr><td className="px-2 py-1">grind_4</td><td className="px-2 py-1 text-cyan-300">0.20 / 0.22 / 0.24</td><td className="px-2 py-1">-0.12 / -0.16 / -0.20</td><td className="px-2 py-1 text-emerald-300">+1.8%</td></tr>
                  <tr><td className="px-2 py-1">grind_5</td><td className="px-2 py-1 text-cyan-300">0.20 / 0.22 / 0.24</td><td className="px-2 py-1">-0.12 / -0.16 / -0.20</td><td className="px-2 py-1 text-emerald-300">+4.8%</td></tr>
                  <tr><td className="px-2 py-1">grind_6</td><td className="px-2 py-1 text-cyan-300">0.10 → 0.18 (9 step)</td><td className="px-2 py-1">-0.03 → -0.22 (9 step)</td><td className="px-2 py-1 text-emerald-300">+1.8%</td></tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-[12px] uppercase tracking-wider text-slate-300 font-bold mt-3 mb-1.5">Grinding v2</h4>
            <ul className="space-y-1 text-slate-300 text-[12.5px]">
              <li>• 3 round grinding (grind_1/2/3) dengan stake{' '}
                <b className="font-mono text-orange-300">[0.20/0.22/0.24/0.26/0.28]</b> dan threshold bertingkat.</li>
              <li>• Derisk per round aktif di <b className="font-mono text-rose-300">-0.26</b>.</li>
              <li>• Batas atas: maksimal <b className="text-white">20 open grinds+buybacks</b> per posisi.</li>
              <li>• Total stake v2 dibatasi <b className="text-white">1.0x</b> dari entry pertama.</li>
            </ul>
          </section>

          {/* Stops & doom */}
          <section>
            <SectionHeader icon={<AlertTriangle className="w-4 h-4 text-rose-400" />} title="Stop loss bertingkat" />
            <div className="overflow-x-auto rounded-lg border border-slate-700/50 mt-2">
              <table className="w-full text-[11.5px] font-mono">
                <thead className="bg-slate-800/60 text-slate-400">
                  <tr>
                    <th className="px-2 py-1.5 text-left">Mode</th>
                    <th className="px-2 py-1.5 text-left">Spot</th>
                    <th className="px-2 py-1.5 text-left">Futures</th>
                    <th className="px-2 py-1.5 text-left">System v3.1</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  <tr><td className="px-2 py-1">Normal stop</td><td className="px-2 py-1">-0.10</td><td className="px-2 py-1">-0.10</td><td className="px-2 py-1 text-slate-500">-</td></tr>
                  <tr><td className="px-2 py-1">Doom stop</td><td className="px-2 py-1">-0.20</td><td className="px-2 py-1">-0.20</td><td className="px-2 py-1 text-amber-300">-0.70 (futures)</td></tr>
                  <tr><td className="px-2 py-1">Rapid stop</td><td className="px-2 py-1">-0.20</td><td className="px-2 py-1">-0.20</td><td className="px-2 py-1 text-amber-300">-0.70 (futures)</td></tr>
                  <tr><td className="px-2 py-1">Scalp stop</td><td className="px-2 py-1">-0.20</td><td className="px-2 py-1">-0.20</td><td className="px-2 py-1 text-amber-300">-0.70 (futures)</td></tr>
                  <tr><td className="px-2 py-1">Rebuy cap</td><td className="px-2 py-1">-1.00</td><td className="px-2 py-1">-1.00</td><td className="px-2 py-1 text-slate-500">-</td></tr>
                  <tr><td className="px-2 py-1">Grind hard stop</td><td className="px-2 py-1">-0.12</td><td className="px-2 py-1">-0.12</td><td className="px-2 py-1 text-slate-500">-</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Exit layers */}
          <section>
            <SectionHeader icon={<Target className="w-4 h-4 text-emerald-400" />} title="Exit bertingkat" />
            <p className="text-slate-300">
              Strategi tidak exit sekaligus di puncak. Ia menutup sebagian posisi di level profit rendah,
              lalu membiarkan sisanya berjalan dengan trailing. Tag exit yang muncul di trade history
              mengikuti pola ini:
            </p>
            <ul className="mt-2 space-y-1 text-slate-300 text-[12.5px]">
              <li>• <b className="font-mono text-emerald-300">exit_long_normal_*</b> — exit dari mode normal/pump/quick.</li>
              <li>• <b className="font-mono text-emerald-300">exit_long_rebuy_e_r / _e_*</b> — exit setelah proses rebuy.</li>
              <li>• <b className="font-mono text-emerald-300">exit_long_grind_1, grind_2, …</b> — exit setelah grinding round ke-N.</li>
              <li>• <b className="font-mono text-amber-300">exit_long_tc_*</b> — exit dari top coins mode.</li>
              <li>• <b className="font-mono text-rose-300">exit_long_*_stoploss_doom</b> — exit karena stop loss keras.</li>
            </ul>
          </section>

          {/* Runtime signals */}
          <section>
            <SectionHeader icon={<TrendingDown className="w-4 h-4 text-cyan-400" />} title="Yang kamu lihat saat bot berjalan" />
            <ol className="mt-2 space-y-2.5">
              <Step
                n={1}
                title="Bot memindai semua pair whitelist di 5 timeframe"
                desc={`Mulai memuat ${startupCandles} candle historis per pair agar indikator valid (EMA, RSI, BB, EWO, MFI, dll).`}
              />
              <Step
                n={2}
                title="Sinyal muncul jika mode tertentu + beberapa filter konfirmasi lulus"
                desc={`Mis. long_normal butuh confluence tren naik di 5m/15m/1h + RSI tidak overbought + volume mendukung.`}
              />
              <Step
                n={3}
                title="Entry pertama dieksekusi"
                desc={`Order BUY pertama dengan stake penuh untuk simbol target. Tag awalan menandakan mode (mis. "120" = long_grind, "61" = long_rebuy).`}
              />
              <Step
                n={4}
                title="Protokol derisk/grind/rebuy menjaga posisi"
                desc={`Saat floating minus dalam, bot menambah entry (rebuy/grind) atau menjual sebagian (derisk).`}
              />
              <Step
                n={5}
                title="Exit di layer profit yang sesuai mode"
                desc={`Sisa posisi ditutup saat sinyal exit muncul atau trailing stop kena. Tag akhir trade history menunjukkan kombinasi mode + alasan exit.`}
              />
            </ol>
          </section>

          {/* Operator advice */}
          <section>
            <SectionHeader icon={<Info className="w-4 h-4 text-slate-400" />} title="Catatan operator" />
            <ul className="mt-2 space-y-1.5 text-slate-300 text-[12.5px]">
              <li>• <b className="text-white">Drawdown adalah fitur.</b> Strategi ini merancang rugi sementara dalam untuk menurunkan harga rata-rata. Jangan panik di hari rugi.</li>
              <li>• <b className="text-white">Periksa trade history.</b> Buka dropdown order di chart candle untuk lihat tag grind_4_entry, derisk_level_1, exit_long_rebuy_e_r — semua aksi bot tercatat di sana.</li>
              <li>• <b className="text-white">Auto-update aktif.</b> Strategi diperbarui berkala oleh author. Versi ini (<b className="text-white">{strategyVersion}</b>) sudah ter-apply dan bot sudah melakukan reload_config — tidak perlu intervensi manual.</li>
              <li>• <b className="text-white">Restart hanya bila perlu.</b> Perubahan konfigurasi via UI ter-reload tanpa restart container.</li>
            </ul>
          </section>

          {/* Footer */}
          <section className="border-t border-slate-700/40 pt-4 text-[11px] text-slate-500 leading-relaxed">
            Blueprint ini adalah ringkasan parameter runtime dari strategi{' '}
            <b className="text-slate-400">{strategyName} {strategyVersion}</b> yang sedang aktif di bot.
            Nilai-nilai turunan (stakes, thresholds, profit target) diambil langsung dari kode strategi
            yang sedang dieksekusi oleh Freqtrade {freqVersion}. Saat upstream merilis versi baru,
            parameter akan berubah otomatis tanpa intervensi manual.
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-sans">{label}</div>
      <div className="font-mono font-bold text-emerald-300 text-base mt-0.5">{value}</div>
      {sub && <div className="text-[10px] text-slate-500 font-sans mt-0.5">{sub}</div>}
    </div>
  );
}

function Feature({ active, icon, title, desc }: { active: boolean; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${
      active
        ? 'border-emerald-500/30 bg-emerald-500/5'
        : 'border-slate-700/50 bg-slate-800/30 opacity-70'
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={active ? 'text-emerald-300' : 'text-slate-500'}>{icon}</span>
        <span className="font-semibold text-sm text-white">{title}</span>
        <span className={`ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${
          active ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-700/40 text-slate-500 border-slate-600/40'
        }`}>{active ? 'ON' : 'OFF'}</span>
      </div>
      <p className="text-slate-400 text-[12px] leading-relaxed">{desc}</p>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-slate-300 font-bold">
      {icon}
      <span>{title}</span>
    </div>
  );
}

function ModeTable({ side, rows }: { side: string; rows: { tag: string; mode: string; desc: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700/50">
      <table className="w-full text-[11.5px] font-mono">
        <thead className="bg-slate-800/60 text-slate-400">
          <tr>
            <th className="px-2 py-1.5 text-left">Tag prefix ({side})</th>
            <th className="px-2 py-1.5 text-left">Mode</th>
            <th className="px-2 py-1.5 text-left">Kapan dipakai</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/40">
          {rows.map((r) => (
            <tr key={r.mode}>
              <td className="px-2 py-1.5 text-amber-300">{r.tag}</td>
              <td className="px-2 py-1.5 text-emerald-300">{r.mode}</td>
              <td className="px-2 py-1.5 font-sans text-slate-300">{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeriskCard({ level, range, stake, desc }: { level: string; range: string; stake: string; desc: string }) {
  return (
    <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2.5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-rose-300 font-bold text-[12px]">{level}</span>
        <span className="ml-auto text-[10px] font-mono text-rose-300">{range}</span>
      </div>
      <div className="font-mono text-[12px] text-rose-200">Stake: {stake}</div>
      <p className="text-slate-400 text-[11.5px] mt-1 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="flex gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-slate-700/60 border border-slate-600/60 text-emerald-300 font-mono font-bold text-[11px] flex items-center justify-center">
        {n}
      </span>
      <div className="min-w-0">
        <div className="font-semibold text-white text-[13px]">{title}</div>
        <div className="text-slate-400 text-[12px] leading-relaxed mt-0.5">{desc}</div>
      </div>
    </li>
  );
}
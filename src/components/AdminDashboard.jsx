export default function AdminDashboard(){
  return (
    <div className="min-h-[40vh] bg-slate-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800">
          <h3 className="text-purple-400 font-bold mb-2">System Metrics</h3>
          <div className="text-slate-300">Live counters coming online...</div>
        </div>
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-800">
          <h3 className="text-red-400 font-bold mb-2">Bulk Tools</h3>
          <div className="text-slate-300">CSV import/export and content management placeholder.</div>
        </div>
      </div>
    </div>
  )
}

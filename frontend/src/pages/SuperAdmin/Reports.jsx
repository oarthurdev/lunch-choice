import { useState } from 'react'
import Layout from '../../components/Layout'
import { getMonthlyReport } from '../../services/api'

const SuperAdminReports = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  const navItems = [
    { path: '/super-admin', label: 'Dashboard' },
    { path: '/super-admin/empresas', label: 'Empresas' },
    { path: '/super-admin/pratos', label: 'Pratos do Dia' },
    { path: '/super-admin/relatorios', label: 'Relatórios' },
  ]

  const handleGenerateReport = async () => {
    try {
      const blob = await getMonthlyReport(year, month)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Relatorio_Mensal_${year}_${month}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Erro ao gerar relatório')
    }
  }

  return (
    <Layout navItems={navItems}>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Relatórios Mensais</h1>

        <div className="bg-white shadow sm:rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gerar Relatório Mensal</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ano</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mês</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerateReport}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md"
          >
            Gerar Relatório PDF
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default SuperAdminReports

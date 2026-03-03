import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, useLoaderData, useSearchParams } from 'react-router-dom'
import { FiChevronDown, FiGlobe, FiMap, FiHome, FiMapPin, FiRefreshCw } from 'react-icons/fi'
import './index.css'

interface Province  { id: number; name: string }
interface Regency   { id: number; name: string; province_id: number }
interface District  { id: number; name: string; regency_id: number }
interface RegionData {
  provinces: Province[]
  regencies: Regency[]
  districts: District[]
}

async function loader() {
  const res = await fetch('/data/indonesia_regions.json')
  const data: RegionData = await res.json()
  return data
}

function FilterPage() {
  const data = useLoaderData() as RegionData
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedProvinceId = searchParams.get('province') ? Number(searchParams.get('province')) : ''
  const selectedRegencyId  = searchParams.get('regency')  ? Number(searchParams.get('regency'))  : ''
  const selectedDistrictId = searchParams.get('district') ? Number(searchParams.get('district')) : ''

  const filteredRegencies = selectedProvinceId ? data.regencies.filter(r => r.province_id === selectedProvinceId) : []
  const filteredDistricts = selectedRegencyId  ? data.districts.filter(d => d.regency_id  === selectedRegencyId)  : []

  const selectedProvince = data.provinces.find(p => p.id === selectedProvinceId)
  const selectedRegency  = data.regencies.find(r => r.id === selectedRegencyId)
  const selectedDistrict = data.districts.find(d => d.id === selectedDistrictId)

  function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    val ? setSearchParams({ province: val }) : setSearchParams({})
  }

  function handleRegencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    val
      ? setSearchParams({ province: String(selectedProvinceId), regency: val })
      : setSearchParams({ province: String(selectedProvinceId) })
  }

  function handleDistrictChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    val
      ? setSearchParams({ province: String(selectedProvinceId), regency: String(selectedRegencyId), district: val })
      : setSearchParams({ province: String(selectedProvinceId), regency: String(selectedRegencyId) })
  }

  function handleReset() {
    setSearchParams({})
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">

      <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col p-6 gap-6">

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
  <FiGlobe size={16} />
</div>
          <span className="font-semibold text-gray-800 text-sm">Frontend Assessment</span>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Filter Wilayah</p>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Provinsi</label>
          <div className="relative">
            <FiMap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              name="province"
              value={selectedProvinceId}
              onChange={handleProvinceChange}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm text-gray-400 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Pilih Provinsi --</option>
              {data.provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Kota/Kabupaten</label>
          <div className="relative">
            <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              name="regency"
              value={selectedRegencyId}
              onChange={handleRegencyChange}
              disabled={!selectedProvinceId}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">-- Pilih Kota/Kabupaten --</option>
              {filteredRegencies.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Kecamatan</label>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              name="district"
              value={selectedDistrictId}
              onChange={handleDistrictChange}
              disabled={!selectedRegencyId}
              className="w-full border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm text-gray-700 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">-- Pilih Kecamatan --</option>
              {filteredDistricts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleReset}
          className="mt-auto border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <FiRefreshCw className="text-gray-500" /> Reset Reset
        </button>

      </aside>

      <div className="flex-1 flex flex-col">


        <nav className="px-10 py-4 border-b border-gray-200 bg-white">
          <ol className="breadcrumb flex items-center gap-2 text-sm text-gray-400">
            <li className={!selectedProvince ? 'text-gray-800 font-medium' : ''}>Indonesia</li>
            {selectedProvince && (
              <>
                <li>›</li>
                <li className={!selectedRegency ? 'text-gray-800 font-medium' : ''}>{selectedProvince.name}</li>
              </>
            )}
            {selectedRegency && (
              <>
                <li>›</li>
                <li className={!selectedDistrict ? 'text-gray-800 font-medium' : ''}>{selectedRegency.name}</li>
              </>
            )}
            {selectedDistrict && (
              <>
                <li>›</li>
                <li className="text-blue-500 font-medium">{selectedDistrict.name}</li>
              </>
            )}
          </ol>
        </nav>

        <main className="flex-1 flex items-center justify-center">
          {!selectedProvince ? (
            <p className="text-gray-500 text-lg">Pilih provinsi untuk memulai</p>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">

              <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Provinsi</p>
              <h2 className="text-5xl font-black text-gray-900">{selectedProvince.name}</h2>

              {selectedRegency && (
                <>
                  <span className="text-gray-300 text-xl mt-2">↓</span>
                  <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mt-2">Kota / Kabupaten</p>
                  <h2 className="text-5xl font-black text-gray-900">{selectedRegency.name}</h2>
                </>
              )}

              {selectedDistrict && (
                <>
                  <span className="text-gray-300 text-xl mt-2">↓</span>
                  <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mt-2">Kecamatan</p>
                  <h2 className="text-5xl font-black text-gray-900">{selectedDistrict.name}</h2>
                </>
              )}

            </div>
          )}
        </main>

      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <FilterPage />,
    loader: loader,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
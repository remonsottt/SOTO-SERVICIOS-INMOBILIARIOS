import { useState, useEffect } from 'react';
import { RefreshCw, Database, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface DataHealth {
  neighborhoodStats: { count: number; updated: string; lowSampleCount: number };
  activeListings: { count: number; latest: string };
  soldTransactions: { count: number; latest: string };
  areaMappings: { count: number };
}

const AdminDataPage = () => {
  const [dataHealth, setDataHealth] = useState<DataHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ headers: string[]; rows: string[][] } | null>(null);

  useEffect(() => {
    loadDataHealth();
  }, []);

  const loadDataHealth = async () => {
    setLoading(true);
    try {
      const [statsRes, listingsRes, soldRes, mappingsRes] = await Promise.all([
        fetch('/data/valuation/neighborhood_stats.csv'),
        fetch('/data/valuation/listings_active.csv'),
        fetch('/data/valuation/sold_public.csv'),
        fetch('/data/valuation/mapping_barrios.csv'),
      ]);

      const [statsText, listingsText, soldText, mappingsText] = await Promise.all([
        statsRes.text(),
        listingsRes.text(),
        soldRes.text(),
        mappingsRes.text(),
      ]);

      const statsLines = statsText.trim().split('\n');
      const listingsLines = listingsText.trim().split('\n');
      const soldLines = soldText.trim().split('\n');
      const mappingsLines = mappingsText.trim().split('\n');

      const statsRows = statsLines.slice(1).map(line => {
        const values = line.split(',');
        return {
          area_id: values[0],
          updated_at: values[11],
          sample_size: parseInt(values[10]) || 0,
        };
      });

      const lowSampleCount = statsRows.filter(r => r.sample_size < 10).length;
      const latestUpdate = statsRows[0]?.updated_at || 'N/A';

      const listingsRows = listingsLines.slice(1).map(line => {
        const values = line.split(',');
        return { date_listed: values[1] };
      });
      const latestListing = listingsRows[0]?.date_listed || 'N/A';

      const soldRows = soldLines.slice(1).map(line => {
        const values = line.split(',');
        return { date_sold: values[1] };
      });
      const latestSold = soldRows[0]?.date_sold || 'N/A';

      setDataHealth({
        neighborhoodStats: {
          count: statsLines.length - 1,
          updated: latestUpdate,
          lowSampleCount,
        },
        activeListings: {
          count: listingsLines.length - 1,
          latest: latestListing,
        },
        soldTransactions: {
          count: soldLines.length - 1,
          latest: latestSold,
        },
        areaMappings: {
          count: mappingsLines.length - 1,
        },
      });
    } catch (error) {
      console.error('Error loading data health:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = async () => {
    setReloading(true);
    await loadDataHealth();
    setReloading(false);
  };

  const loadPreview = async (dataset: string) => {
    if (expandedSection === dataset) {
      setExpandedSection(null);
      setPreviewData(null);
      return;
    }

    setExpandedSection(dataset);

    const fileMap: Record<string, string> = {
      stats: '/data/valuation/neighborhood_stats.csv',
      listings: '/data/valuation/listings_active.csv',
      sold: '/data/valuation/sold_public.csv',
      mappings: '/data/valuation/mapping_barrios.csv',
    };

    const response = await fetch(fileMap[dataset]);
    const text = await response.text();
    const lines = text.trim().split('\n').slice(0, 11);

    setPreviewData({
      headers: lines[0].split(','),
      rows: lines.slice(1, 11).map(l => l.split(',')),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#223e28] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#223e28]">Panel de Administración</h1>
              <p className="text-sm text-gray-600 mt-1">Gestión de datos de valoración</p>
            </div>
            <button
              onClick={handleReload}
              disabled={reloading}
              className="flex items-center gap-2 bg-[#223e28] text-white px-6 py-3 rounded-lg hover:bg-[#2d5236] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${reloading ? 'animate-spin' : ''}`} />
              Recargar datos
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-[#223e28]" />
                <h2 className="text-xl font-semibold text-gray-900">Estadísticas por Barrio</h2>
              </div>
              <button
                onClick={() => loadPreview('stats')}
                className="text-[#223e28] hover:text-[#2d5236]"
              >
                {expandedSection === 'stats' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{dataHealth?.neighborhoodStats.count}</span> registros
              </p>
              <p className="text-gray-600">
                Actualizado: <span className="font-medium">{dataHealth?.neighborhoodStats.updated}</span>
              </p>
              {dataHealth && dataHealth.neighborhoodStats.lowSampleCount > 0 && (
                <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    {dataHealth.neighborhoodStats.lowSampleCount} áreas con muestra &lt; 10
                  </p>
                </div>
              )}
            </div>
            {expandedSection === 'stats' && previewData && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {previewData.headers.slice(0, 5).map((h: string, i: number) => (
                        <th key={i} className="px-2 py-2 text-left font-medium text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row: string[], i: number) => (
                      <tr key={i} className="border-t border-gray-200">
                        {row.slice(0, 5).map((cell: string, j: number) => (
                          <td key={j} className="px-2 py-2 text-gray-600">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-[#223e28]" />
                <h2 className="text-xl font-semibold text-gray-900">Listings Activos</h2>
              </div>
              <button
                onClick={() => loadPreview('listings')}
                className="text-[#223e28] hover:text-[#2d5236]"
              >
                {expandedSection === 'listings' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{dataHealth?.activeListings.count}</span> propiedades
              </p>
              <p className="text-gray-600">
                Más reciente: <span className="font-medium">{dataHealth?.activeListings.latest}</span>
              </p>
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">Datos actualizados</p>
              </div>
            </div>
            {expandedSection === 'listings' && previewData && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {previewData.headers.slice(0, 5).map((h: string, i: number) => (
                        <th key={i} className="px-2 py-2 text-left font-medium text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row: string[], i: number) => (
                      <tr key={i} className="border-t border-gray-200">
                        {row.slice(0, 5).map((cell: string, j: number) => (
                          <td key={j} className="px-2 py-2 text-gray-600">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-[#223e28]" />
                <h2 className="text-xl font-semibold text-gray-900">Transacciones Vendidas</h2>
              </div>
              <button
                onClick={() => loadPreview('sold')}
                className="text-[#223e28] hover:text-[#2d5236]"
              >
                {expandedSection === 'sold' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{dataHealth?.soldTransactions.count}</span> ventas
              </p>
              <p className="text-gray-600">
                Más reciente: <span className="font-medium">{dataHealth?.soldTransactions.latest}</span>
              </p>
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">Datos históricos disponibles</p>
              </div>
            </div>
            {expandedSection === 'sold' && previewData && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {previewData.headers.slice(0, 5).map((h: string, i: number) => (
                        <th key={i} className="px-2 py-2 text-left font-medium text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row: string[], i: number) => (
                      <tr key={i} className="border-t border-gray-200">
                        {row.slice(0, 5).map((cell: string, j: number) => (
                          <td key={j} className="px-2 py-2 text-gray-600">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-[#223e28]" />
                <h2 className="text-xl font-semibold text-gray-900">Mapeo de Barrios</h2>
              </div>
              <button
                onClick={() => loadPreview('mappings')}
                className="text-[#223e28] hover:text-[#2d5236]"
              >
                {expandedSection === 'mappings' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{dataHealth?.areaMappings.count}</span> mapeos
              </p>
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">Diccionario completo</p>
              </div>
            </div>
            {expandedSection === 'mappings' && previewData && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {previewData.headers.map((h: string, i: number) => (
                        <th key={i} className="px-2 py-2 text-left font-medium text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row: string[], i: number) => (
                      <tr key={i} className="border-t border-gray-200">
                        {row.map((cell: string, j: number) => (
                          <td key={j} className="px-2 py-2 text-gray-600">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-[#223e28]" />
            <h2 className="text-2xl font-semibold text-gray-900">Metodología</h2>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Fuentes de Datos</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Estadísticas agregadas por barrio y municipio (actualización mensual)</li>
                <li>Listings activos de los últimos 90 días</li>
                <li>Transacciones históricas verificadas</li>
                <li>Diccionario de áreas para resolución de inputs</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Proceso de Limpieza</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Eliminación de outliers (±3 desviaciones estándar)</li>
                <li>Validación de coordenadas geográficas</li>
                <li>Normalización de tipos de propiedad</li>
                <li>Verificación de precios por m² realistas</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Niveles de Confianza</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Alta:</strong> Muestra ≥ 20 transacciones, DOM &lt; 60 días (±8%)</li>
                <li><strong>Media:</strong> Muestra 10-19 transacciones (±10%)</li>
                <li><strong>Baja:</strong> Muestra &lt; 10 transacciones (±15%)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ventanas de Tendencia</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Tendencia 3 meses: Cambio porcentual en precio mediano</li>
                <li>Tendencia 12 meses: Visión anual del mercado</li>
                <li>DOM (Días en mercado): Mediana de tiempo hasta venta</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDataPage;

import { useEffect, useState } from 'react';
import { edgeFetch, getSupabaseEnv } from '../lib/edgeClient';

interface DiagnosticResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  url?: string;
  statusCode?: number;
  error?: string;
  responseTime?: number;
}

export function EdgeDiagnostics() {
  const isDev = import.meta.env.DEV;
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (!isDev) return;

    const runDiagnostics = async () => {
      const env = getSupabaseEnv();

      console.group('🔍 Edge Functions Diagnostics');
      console.log('Environment:', isDev ? 'DEVELOPMENT' : 'PRODUCTION');
      console.log('Supabase URL:', env?.url || '❌ MISSING');
      console.log('Supabase Key:', env?.key ? '✅ Present' : '❌ MISSING');
      console.groupEnd();

      const functions = [
        { name: 'notion-properties', endpoint: 'notion-properties' },
        { name: 'notion-blog', endpoint: 'notion-blog' },
        { name: 'notion-valuation', endpoint: 'notion-valuation' },
        { name: 'notion-contacts', endpoint: 'notion-contacts' },
      ];

      const diagnosticResults: DiagnosticResult[] = [];

      for (const func of functions) {
        const startTime = performance.now();
        const result: DiagnosticResult = {
          name: func.name,
          status: 'pending',
        };

        try {
          const response = await edgeFetch(func.endpoint, {
            method: 'GET',
          });

          const endTime = performance.now();
          result.responseTime = Math.round(endTime - startTime);
          result.statusCode = response.status;

          if (response.ok) {
            result.status = 'success';
            console.log(`✅ ${func.name}: OK (${result.statusCode}) in ${result.responseTime}ms`);
          } else {
            result.status = 'error';
            result.error = `HTTP ${response.status}`;
            console.error(`❌ ${func.name}: ${result.error}`);
          }
        } catch (error) {
          result.status = 'error';
          result.error = error instanceof Error ? error.message : 'Unknown error';
          console.error(`❌ ${func.name}: ${result.error}`);
        }

        diagnosticResults.push(result);
      }

      setResults(diagnosticResults);
    };

    setTimeout(runDiagnostics, 1000);
  }, [isDev]);

  if (!isDev) return null;

  return (
    <>
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '10px 15px',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        🔍 Edge Diagnostics
      </button>

      {showPanel && (
        <div
          style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            zIndex: 9999,
            background: 'white',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '20px',
            minWidth: '350px',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        >
          <div style={{ marginBottom: '15px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#111827' }}>
              Edge Functions Status
            </h3>
            <div style={{ color: '#6b7280', fontSize: '11px' }}>
              Environment: <strong>{isDev ? 'DEVELOPMENT' : 'PRODUCTION'}</strong>
            </div>
            <div style={{ color: '#6b7280', fontSize: '11px' }}>
              Supabase: <strong>{getSupabaseEnv()?.url ? '✅ Connected' : '❌ Not configured'}</strong>
            </div>
          </div>

          {results.length === 0 ? (
            <div style={{ color: '#6b7280', padding: '20px', textAlign: 'center' }}>
              Running diagnostics...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {results.map((result) => (
                <div
                  key={result.name}
                  style={{
                    padding: '10px',
                    background: result.status === 'success' ? '#d1fae5' : '#fee2e2',
                    borderRadius: '6px',
                    border: `1px solid ${result.status === 'success' ? '#10b981' : '#ef4444'}`,
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#111827' }}>
                    {result.status === 'success' ? '✅' : '❌'} {result.name}
                  </div>
                  {result.statusCode && (
                    <div style={{ color: '#6b7280' }}>
                      Status: {result.statusCode}
                    </div>
                  )}
                  {result.responseTime && (
                    <div style={{ color: '#6b7280' }}>
                      Response: {result.responseTime}ms
                    </div>
                  )}
                  {result.error && (
                    <div style={{ color: '#dc2626', fontSize: '11px', marginTop: '5px' }}>
                      Error: {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                width: '100%',
                padding: '8px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              🔄 Re-run Tests
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import React from 'react'
import { AudioUploader } from './components/audio/AudioUploader'
import { useUnifiedProcessing } from './hooks/useUnifiedProcessing'

function App() {
  const { processAudio, isLoading, error, transcription, summary, processingState } = useUnifiedProcessing()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50 text-gray-900">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-semibold gradient-title">Vietnamese news speech to text summarization</h1>
          <p className="text-sm text-gray-600">Upload audio/video to transcribe and summarize</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 grid gap-8 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-5">
          <h2 className="text-lg font-medium">1) Upload file</h2>
          <AudioUploader onFileUploaded={(file) => processAudio(file)} />

          {processingState.stage !== 'idle' && (
            <div className="mt-4 text-sm">
              <div className="font-medium">Status: {processingState.stage}</div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div className="h-2 bg-blue-600" style={{ width: `${processingState.progress}%` }} />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </section>

        <section className="space-y-4 lg:col-span-7">
          <h2 className="text-lg font-medium">2) Results</h2>
          <div className="grid gap-4">
            <div className="gradient-panel">
              <div className="result-card">
              <div className="mb-2 text-sm font-medium text-gray-700">Transcription</div>
              <textarea
                className="textarea-light p-3"
                value={transcription || ''}
                readOnly
                placeholder={isLoading ? 'Processing…' : 'Transcribed text will appear here'}
              />
              </div>
            </div>

            <div className="gradient-panel">
              <div className="result-card">
              <div className="mb-2 text-sm font-medium text-gray-700">Summary</div>
              <textarea
                className="textarea-light p-3"
                value={summary || ''}
                readOnly
                placeholder={isLoading ? 'Processing…' : 'Summary will appear here'}
              />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* footer removed as requested */}
    </div>
  )
}

export default App

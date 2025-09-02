import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './store'
import type { AppDispatch } from './store'
import { loadData } from './slices/dataSlice'
import MapView from './components/MapView'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const isLoading = useSelector((s: RootState) => s.data.isLoading)
  useEffect(() => {
    dispatch(loadData())
  }, [dispatch])

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      {isLoading && (
        <div className="app-loader-overlay">
          <div className="app-spinner" />
        </div>
      )}
      <MapView />
    </div>
  )
}

export default App
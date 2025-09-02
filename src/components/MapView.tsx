import { MapContainer, TileLayer, CircleMarker, Tooltip, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { costToColor } from '../types';
import { setSelectedFrom } from '../slices/selectionSlice';

function MapClickReset() {
  const dispatch = useDispatch();
  useMapEvent('click', () => {
    dispatch(setSelectedFrom(undefined));
  });
  return null;
}

export default function MapView() {
  const { sites, costs } = useSelector((s: RootState) => s.data);
  const selectedFromId = useSelector((s: RootState) => s.selection.selectedFromId);
  const dispatch = useDispatch();

  const center = { lat: 55.76, lng: 37.62 };

  return (
    <>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
        <MapClickReset />
        {sites.map(site => {
        const selectedCosts = selectedFromId ? costs[selectedFromId] : undefined;
        const isSelected = selectedFromId === site.site_id;
        const metrics = selectedCosts ? selectedCosts[site.site_id] : undefined;
        const color = selectedFromId
          ? (isSelected ? '#1976d2' : costToColor(metrics?.cost))
          : '#3388ff';
        const radius = selectedFromId ? (isSelected ? 15 : 11) : 10;
        return (
          <CircleMarker
            key={site.site_id}
            center={[site.latitude, site.longitude]}
            pathOptions={{ color: '#8C92AC', weight: 2, opacity: 1, fillColor: color, fillOpacity: 1 }}
            radius={radius}
            bubblingMouseEvents={false}
            eventHandlers={{
              click: () => dispatch(setSelectedFrom(site.site_id)),
            }}
          >
            <Tooltip className="stop-tooltip" direction="top" offset={[0, -4]} opacity={1} permanent={false} sticky>
              <div>
                <div><strong>{site.site_id}</strong> — {site.site_name}</div>
                {selectedFromId && isSelected && (
                  <div style={{ marginTop: 4 }}>начальная остановка</div>
                )}
                {selectedFromId && !isSelected && metrics && (
                  <div style={{ marginTop: 4 }}>
                    <div>cost: {metrics.cost.toFixed(2)} мин</div>
                    <div>iwait: {metrics.iwait.toFixed(2)} мин</div>
                    <div>inveht: {metrics.inveht.toFixed(2)} мин</div>
                    <div>xnum: {metrics.xnum}</div>
                    <div>xpen: {metrics.xpen.toFixed(2)} мин</div>
                  </div>
                )}
                {selectedFromId && !isSelected && !metrics && (
                  <div style={{ marginTop: 4 }}>Нельзя доехать</div>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
      </MapContainer>
    </>
  );
}
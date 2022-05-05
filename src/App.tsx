import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { DeckGL } from "@deck.gl/react";
import { Layer, Deck, MapView } from "@deck.gl/core";
import "./styles.css";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer, ArcLayer } from "@deck.gl/layers";
import {
  ContextProviderValue,
  InitialViewStateProps
} from "@deck.gl/core/lib/deck";
import { FlyToInterpolator } from "@deck.gl/core";

const context = React.createContext<ContextProviderValue | null>(null);
const CHld = (props: any) => {
  const ctx = useContext(context);

  useEffect(() => {
    console.log(ctx?.viewport);
  }, []);

  return <button onClick={() => props.onClick()}>Something</button>;
};

const arcLayer = new ArcLayer({
  id: "arcs",
  data:
    "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson",
  //@ts-ignore
  dataTransform: (d) => d.features.filter((f) => f.properties.scalerank > 6),
  getSourcePosition: (f) => [106.65429615117164, -6.126602955972902],
  getTargetPosition: (f) => f.geometry.coordinates,
  getSourceColor: [200, 0, 80],
  getTargetColor: [200, 0, 80],
  getWidth: 1
});
const layer = new TileLayer({
  data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
  minZoom: 0,
  maxZoom: 19,
  tileSize: 256,
  renderSubLayers: (props) => {
    const {
      bbox: { west, south, east, north }
    } = props.tile;

    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north]
    });
  }
});

export default function App() {
  const [vState, setVState] = useState<InitialViewStateProps>({
    zoom: 15,
    longitude: 106.82718034099645,
    latitude: -6.175397968558875,
    pitch: 0,
    bearing: 0
  });

  const goToNYC = useCallback(() => {
    setVState({
      longitude: -74.1,
      latitude: 40.7,
      zoom: 14,
      pitch: 30,
      bearing: 30,
      transitionDuration: 8000,
      transitionInterpolator: new FlyToInterpolator()
    });
  }, []);
  return (
    <React.Fragment>
      <DeckGL
        initialViewState={vState}
        controller={true}
        width="100%"
        height="100vh"
        layers={[layer, arcLayer]}
        ContextProvider={context.Provider}
        onClick={(e) => console.log(e)}
      >
        <CHld onClick={() => goToNYC()} />
      </DeckGL>
    </React.Fragment>
  );
}

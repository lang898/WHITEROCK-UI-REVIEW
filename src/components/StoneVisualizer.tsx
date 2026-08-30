import React, { useState } from 'react';
import { Check, Eye, Package } from 'lucide-react';
import { colors } from '../data';
import type { ColorItem, LocaleConfig } from '../types';

interface StoneVisualizerProps {
  currentLocale?: LocaleConfig;
  onRequestSample?: (color: ColorItem) => void;
}

interface Scene {
  id: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  mask: string;
}

const scenes: Scene[] = [
  {
    id: 'kitchen',
    name: 'Kitchen island',
    category: 'Kitchen',
    image: '/assets/owner/countertops/waterfall-kitchen-island.jpg',
    alt: 'Owner-supplied waterfall kitchen island application',
    mask: 'polygon(0 48%, 72% 28%, 100% 37%, 100% 67%, 29% 88%, 0 76%)'
  },
  {
    id: 'bathroom',
    name: 'Bathroom vanity',
    category: 'Bathroom',
    image: '/assets/applications/master-bath-inspiration.jpg',
    alt: 'Illustrative bathroom application scene',
    mask: 'polygon(14% 54%, 89% 54%, 94% 65%, 8% 66%)'
  },
  {
    id: 'hospitality',
    name: 'Hotel reception',
    category: 'Hospitality',
    image: '/assets/applications/hotel-lobby-inspiration.jpg',
    alt: 'Illustrative hotel lobby application scene',
    mask: 'polygon(19% 48%, 83% 48%, 90% 73%, 11% 73%)'
  },
  {
    id: 'furniture',
    name: 'Furniture top',
    category: 'Furniture',
    image: '/assets/owner/countertops/marble-coffee-top-living-room.jpg',
    alt: 'Owner-supplied marble coffee table application',
    mask: 'polygon(2% 61%, 93% 45%, 100% 62%, 9% 82%)'
  }
];

export const StoneVisualizer: React.FC<StoneVisualizerProps> = ({ onRequestSample }) => {
  const [selectedSceneId, setSelectedSceneId] = useState(scenes[0].id);
  const [selectedColorSlug, setSelectedColorSlug] = useState(colors[0].slug);
  const [overlayStrength, setOverlayStrength] = useState(72);
  const activeScene = scenes.find((scene) => scene.id === selectedSceneId) || scenes[0];
  const activeColor = colors.find((color) => color.slug === selectedColorSlug) || colors[0];

  return (
    <section className="wr-visualizer" aria-labelledby="visualizer-title">
      <header>
        <div><span className="wr-eyebrow">Material visualizer</span><h2 id="visualizer-title">Preview a color direction in a preset space.</h2></div>
        <p>This composited preview is for early visual direction only. It does not represent final slab scale, vein placement, color, fabrication, or installation.</p>
      </header>

      <div className="wr-visualizer__workspace">
        <div className="wr-visualizer__stage">
          <img src={activeScene.image} alt={activeScene.alt} width="1600" height="1100" loading="lazy" />
          <div className="wr-visualizer__surface" style={{ clipPath: activeScene.mask, backgroundImage: `url(${activeColor.swatchImage})`, opacity: overlayStrength / 100 }} aria-hidden="true" />
          <span>{activeScene.category} · simulated surface layer</span>
        </div>

        <aside className="wr-visualizer__controls">
          <fieldset><legend>Preset scene</legend><div className="wr-segmented-control">{scenes.map((scene) => <button key={scene.id} className={selectedSceneId === scene.id ? 'is-active' : ''} onClick={() => setSelectedSceneId(scene.id)}>{scene.name}</button>)}</div></fieldset>
          <fieldset><legend>Color direction</legend><div className="wr-visualizer__swatches">{colors.slice(0, 12).map((color) => <button key={color.slug} className={selectedColorSlug === color.slug ? 'is-active' : ''} onClick={() => setSelectedColorSlug(color.slug)} aria-label={`Preview ${color.name}`}><img src={color.swatchImage} alt="" width="120" height="120" /><span>{color.name}</span>{selectedColorSlug === color.slug && <Check />}</button>)}</div></fieldset>
          <label className="wr-visualizer__strength"><span>Texture overlay strength</span><input type="range" min="35" max="90" value={overlayStrength} onInput={(event) => setOverlayStrength(Number(event.currentTarget.value))} /></label>
          <div className="wr-visualizer__selection"><Eye /><div><small>Current direction</small><strong>{activeColor.name}</strong><span>{activeColor.material} · {activeScene.name}</span></div></div>
          {onRequestSample && <button className="wr-button wr-button--primary" onClick={() => onRequestSample(activeColor)}><Package />Order {activeColor.name} sample</button>}
        </aside>
      </div>
    </section>
  );
};

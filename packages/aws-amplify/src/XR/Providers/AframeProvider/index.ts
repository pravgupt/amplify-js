import { AbstractXRProvider } from '../XRProvider';
import { ProviderOptions } from '../../types';
import { v4 as uuid } from 'uuid';

export class AframeProvider extends AbstractXRProvider {
  constructor(options: ProviderOptions = {}) {
      super({ ...options, clientId: options.clientId || uuid(), });
  }

  getProviderName() { return 'AframeProvider'; }

  loadScene(sceneId: string) {
    // Load aframe
    const script = document.createElement("script");
    script.src = "https://aframe.io/releases/0.8.2/aframe.min.js";
    script.async = false;
    document.head.appendChild(script);
  }
}

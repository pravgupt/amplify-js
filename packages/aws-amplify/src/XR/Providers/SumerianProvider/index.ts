import { AbstractXRProvider } from '../XRProvider';
import { ProviderOptions } from '../../types';
import { v4 as uuid } from 'uuid';
import { enginerUrls } from './engine';

export class SumerianProvider extends AbstractXRProvider {
  constructor(options: ProviderOptions = {}) {
      super({ ...options, clientId: options.clientId || uuid(), });
  }

  getProviderName() { return 'SumerianProvider'; }

  loadScene(sceneId: string) {
    const baseBundleUrl = "https://myeqgqfbvg.execute-api.us-east-1.amazonaws.com/Prod//api/projects";
    const userArn = "arn:aws:sts::902789148998:assumed-role/Admin/jranz-Isengard";
    const sceneResource = `resources/${sceneId}/publish?`;
    
    const publishParams = {
      manuallyStartGameLoop: true,
      antialias: true,
      useDevicePixelRatio: false,
      bundleMetadataUrl: `${baseBundleUrl}/${userArn}/${sceneResource}`,
      logo: true,
      alpha: false
    };

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "//content.sumerian.amazonaws.com/static/published/styles/style.css";
    document.head.appendChild(link);

    // Load engine files
    enginerUrls.map(url => {
      const script = document.createElement("script");
      script.src = url;
      script.async = false;
      document.head.appendChild(script);
    });

    // Load bootstrapper
    const script = document.createElement("script");
    script.src = "https://s3.amazonaws.com/sumerian-test-bucket/sumerian-bootstrapper.js";
    script.async = false;
    script.onload = function() {
      const rootPath = 'res';
      // Run bootstrapper when script has loaded
      (window as any).SumerianBootstrapper(publishParams, rootPath, (window as any).sumerian);
    };
    document.body.appendChild(script);
  }
}

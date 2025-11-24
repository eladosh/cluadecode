import JSZip from 'jszip';
import { GameDesign } from '../types';
import { BuildConfig, AdNetwork } from '../types/networks';
import { generatePlayableHTML } from './export';

/**
 * Network-specific HTML generation
 * Adapts the playable ad for different ad network requirements
 */
const generateNetworkHTML = (design: GameDesign, config: BuildConfig): string => {
  const baseHTML = generatePlayableHTML(design);
  const { network, protocol = 'none' } = config;

  // Network-specific modifications
  let modifiedHTML = baseHTML;

  // Add MRAID support if needed
  if (protocol === 'mraid') {
    modifiedHTML = injectMRAID(modifiedHTML);
  }

  // Add DAPI support if needed
  if (protocol === 'dapi') {
    modifiedHTML = injectDAPI(modifiedHTML);
  }

  // Network-specific optimizations
  modifiedHTML = applyNetworkOptimizations(modifiedHTML, network);

  return modifiedHTML;
};

/**
 * Inject MRAID (Mobile Rich Media Ad Interface Definitions) support
 */
const injectMRAID = (html: string): string => {
  const mraidScript = `
  <script>
    // MRAID Initialization
    (function() {
      var mraid = window.mraid = window.mraid || {};
      mraid.getState = function() { return 'default'; };
      mraid.addEventListener = function(event, listener) {
        if (event === 'ready') {
          setTimeout(listener, 100);
        }
      };
      mraid.open = function(url) {
        window.open(url, '_blank');
      };
      mraid.close = function() {
        console.log('MRAID close called');
      };
    })();
  </script>`;

  return html.replace('</head>', `${mraidScript}</head>`);
};

/**
 * Inject DAPI (Digital Audio Ad Interface) support
 */
const injectDAPI = (html: string): string => {
  const dapiScript = `
  <script src="https://imasdk.googleapis.com/js/sdkloader/ima3_dai.js"></script>
  <script>
    // DAPI Initialization
    window.dapi = window.dapi || {
      isReady: function() { return true; },
      addEventListener: function() {},
      removeEventListener: function() {}
    };
  </script>`;

  return html.replace('</head>', `${dapiScript}</head>`);
};

/**
 * Apply network-specific optimizations
 */
const applyNetworkOptimizations = (html: string, network: AdNetwork): string => {
  let optimized = html;

  switch (network) {
    case 'facebook':
      // Facebook specific optimizations
      optimized = optimized.replace(
        '<meta name="viewport"',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><meta property="og:type" content="game"'
      );
      break;

    case 'google':
      // Google Ads specific optimizations
      optimized = optimized.replace(
        '</head>',
        '<meta name="ad.size" content="width=320,height=480"></head>'
      );
      break;

    case 'unity':
      // Unity Ads optimizations
      optimized = optimized.replace(
        '</head>',
        '<meta name="unity-playable" content="true"></head>'
      );
      break;

    case 'applovin':
      // AppLovin optimizations
      optimized = optimized.replace(
        '</head>',
        '<meta name="applovin:playable_ad_version" content="1.0"></head>'
      );
      break;

    case 'ironsource':
      // ironSource optimizations
      optimized = injectMRAID(optimized);
      break;

    default:
      // Default optimizations for other networks
      break;
  }

  // Minify HTML (basic optimization)
  optimized = minifyHTML(optimized);

  return optimized;
};

/**
 * Basic HTML minification
 */
const minifyHTML = (html: string): string => {
  return html
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/>\s+</g, '><') // Remove spaces between tags
    .replace(/\s+$/gm, '') // Remove trailing spaces
    .trim();
};

/**
 * Create a ZIP file with the playable ad and metadata
 */
const createZipArchive = async (
  html: string,
  config: BuildConfig
): Promise<Blob> => {
  const zip = new JSZip();

  // Add the main HTML file
  zip.file('index.html', html);

  // Add build metadata
  const metadata = {
    network: config.network,
    version: config.version || '1.0.0',
    app: config.app || 'Playable Ad',
    buildDate: new Date().toISOString(),
    protocol: config.protocol || 'none'
  };

  zip.file('build-info.json', JSON.stringify(metadata, null, 2));

  // Add network-specific files if needed
  if (config.network === 'facebook') {
    zip.file('fbapp-config.json', JSON.stringify({
      name: config.app,
      store_url: config.appStoreUrl || ''
    }, null, 2));
  }

  return await zip.generateAsync({ type: 'blob' });
};

/**
 * Main build function for network-specific playable ads
 */
export const buildForNetwork = async (
  design: GameDesign,
  config: BuildConfig
): Promise<void> => {
  try {
    // Generate network-specific HTML
    const html = generateNetworkHTML(design, config);

    // Estimate file size
    const htmlBlob = new Blob([html], { type: 'text/html' });
    const sizeKB = (htmlBlob.size / 1024).toFixed(2);

    console.log(`Generated ${config.network} build: ${sizeKB}KB`);

    // Create download
    if (config.createZip) {
      // Create ZIP archive
      const zipBlob = await createZipArchive(html, config);
      const zipSizeKB = (zipBlob.size / 1024).toFixed(2);

      console.log(`ZIP archive: ${zipSizeKB}KB`);

      // Download ZIP
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.name || 'playable-ad'}-${config.network}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // Download HTML only
      const url = URL.createObjectURL(htmlBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.name || 'playable-ad'}-${config.network}.html`;
      link.click();
      URL.revokeObjectURL(url);
    }

    // Show success notification
    console.log(`✓ Build complete for ${config.network}`);

    // Warn about file size if too large
    if (htmlBlob.size > 2 * 1024 * 1024) {
      console.warn(`⚠️ File size (${sizeKB}KB) exceeds 2MB. Some networks may reject this.`);
      alert(`Warning: File size (${sizeKB}KB) is quite large. Consider optimizing your playable ad.`);
    }

  } catch (error) {
    console.error('Build failed:', error);
    throw error;
  }
};

/**
 * Validate design before building
 */
export const validateDesign = (design: GameDesign): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (design.elements.length === 0) {
    errors.push('No elements in the design');
  }

  if (!design.config.title) {
    errors.push('Missing ad title');
  }

  if (design.config.width < 100 || design.config.height < 100) {
    errors.push('Canvas size too small');
  }

  if (design.config.width > 2048 || design.config.height > 2048) {
    errors.push('Canvas size too large (max 2048x2048)');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

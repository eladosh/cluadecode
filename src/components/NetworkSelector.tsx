import React, { useState } from 'react';
import { X, Network, Download, Settings2, Info } from 'lucide-react';
import { AD_NETWORKS, BuildConfig, AdNetwork, NetworkConfig } from '../types/networks';
import { useBuilderStore } from '../store';
import { buildForNetwork } from '../utils/networkBuilder';

export const NetworkSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<AdNetwork>('preview');
  const [buildConfig, setBuildConfig] = useState<BuildConfig>({
    network: 'preview',
    version: '1.0.0',
    createZip: true
  });
  const [isBuilding, setIsBuilding] = useState(false);

  const { design } = useBuilderStore();

  const handleBuild = async () => {
    setIsBuilding(true);
    try {
      const finalConfig: BuildConfig = {
        ...buildConfig,
        network: selectedNetwork,
        app: design.config.title,
        name: design.config.title.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
        appStoreUrl: design.config.ctaUrl || '',
        googlePlayUrl: design.config.ctaUrl || ''
      };

      await buildForNetwork(design, finalConfig);

      // Close modal after successful build
      setTimeout(() => {
        setIsOpen(false);
        setIsBuilding(false);
      }, 1000);
    } catch (error) {
      console.error('Build failed:', error);
      alert(`Build failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsBuilding(false);
    }
  };

  const selectedNetworkConfig = AD_NETWORKS.find(n => n.id === selectedNetwork);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-4 p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg shadow-lg transition-all z-40 flex items-center gap-2 font-semibold"
        title="Build for Ad Networks"
      >
        <Network size={20} />
        <span className="text-sm">Build for Networks</span>
      </button>
    );
  }

  const majorNetworks = AD_NETWORKS.filter(n => n.category === 'major');
  const standardNetworks = AD_NETWORKS.filter(n => n.category === 'standard');
  const otherNetworks = AD_NETWORKS.filter(n => n.category === 'other');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Network size={28} className="text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold">Build for Ad Networks</h2>
              <p className="text-sm text-gray-400">Export optimized playable ads for specific platforms</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Network Selection */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Network size={20} />
                Select Ad Network
              </h3>

              {/* Major Networks */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Major Networks</h4>
                <div className="space-y-2">
                  {majorNetworks.map((network) => (
                    <NetworkOption
                      key={network.id}
                      network={network}
                      isSelected={selectedNetwork === network.id}
                      onSelect={() => setSelectedNetwork(network.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Standard Networks */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Standard Networks</h4>
                <div className="space-y-2">
                  {standardNetworks.map((network) => (
                    <NetworkOption
                      key={network.id}
                      network={network}
                      isSelected={selectedNetwork === network.id}
                      onSelect={() => setSelectedNetwork(network.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Other Networks */}
              <details className="mb-4">
                <summary className="text-sm font-semibold text-gray-400 mb-2 cursor-pointer">
                  More Networks ({otherNetworks.length})
                </summary>
                <div className="space-y-2 mt-2">
                  {otherNetworks.map((network) => (
                    <NetworkOption
                      key={network.id}
                      network={network}
                      isSelected={selectedNetwork === network.id}
                      onSelect={() => setSelectedNetwork(network.id)}
                    />
                  ))}
                </div>
              </details>
            </div>

            {/* Build Configuration */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings2 size={20} />
                Build Configuration
              </h3>

              {selectedNetworkConfig && (
                <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Info size={16} className="text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{selectedNetworkConfig.name}</p>
                      <p className="text-xs text-gray-400">{selectedNetworkConfig.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Protocol: {selectedNetworkConfig.defaultProtocol}
                        {selectedNetworkConfig.supportsZip && ' • Supports ZIP export'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Version</label>
                  <input
                    type="text"
                    value={buildConfig.version || ''}
                    onChange={(e) => setBuildConfig({ ...buildConfig, version: e.target.value })}
                    placeholder="1.0.0"
                    className="w-full px-3 py-2 bg-gray-700 rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">App Name</label>
                  <input
                    type="text"
                    value={design.config.title}
                    disabled
                    className="w-full px-3 py-2 bg-gray-700/50 rounded text-sm text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">From canvas settings</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Store URL</label>
                  <input
                    type="text"
                    value={design.config.ctaUrl || ''}
                    disabled
                    className="w-full px-3 py-2 bg-gray-700/50 rounded text-sm text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">From canvas settings</p>
                </div>

                {selectedNetworkConfig?.supportsZip && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="createZip"
                      checked={buildConfig.createZip ?? true}
                      onChange={(e) => setBuildConfig({ ...buildConfig, createZip: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="createZip" className="text-sm font-medium">
                      Create ZIP archive
                    </label>
                  </div>
                )}

                <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 text-xs">
                  <p className="font-semibold mb-1">ℹ️ Build Info</p>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Automatic minification and optimization</li>
                    <li>• Network-specific adaptations</li>
                    <li>• MRAID/DAPI integration (if needed)</li>
                    <li>• File size optimization for ad networks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-750 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Powered by <span className="font-semibold">@smoud/playable-scripts</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBuild}
              disabled={isBuilding}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBuilding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Building...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Build & Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NetworkOptionProps {
  network: NetworkConfig;
  isSelected: boolean;
  onSelect: () => void;
}

const NetworkOption: React.FC<NetworkOptionProps> = ({ network, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected
          ? 'bg-purple-600 ring-2 ring-purple-400'
          : 'bg-gray-700 hover:bg-gray-600'
      }`}
    >
      <div className="font-semibold text-sm">{network.name}</div>
      <div className="text-xs text-gray-300 mt-0.5">{network.description}</div>
    </button>
  );
};

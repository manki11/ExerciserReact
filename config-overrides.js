const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
    let resolvePlugin = (config.resolveLoader?config.resolveLoader: {});
    resolvePlugin['alias']= {
      'text': 'text-loader'
    };
    config['resolveLoader'] = resolvePlugin;

    let resolvePath = config.resolve.alias;
    resolvePath['webL10n'] = 'lib/webL10n';
    resolvePath['sugar-web'] = 'lib/sugar-web';
    resolvePath['mustache'] = 'lib/mustache';
    resolvePath['picoModal'] = 'lib/picoModal';    
    config.resolve.alias = resolvePath;

    return config;
}
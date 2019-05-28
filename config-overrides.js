const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
    var aliasObj = config.resolve.alias;
    aliasObj['webL10n'] = 'lib/webL10n';
    aliasObj['sugar-web'] = 'lib/sugar-web';
    aliasObj['mustache'] = 'lib/mustache';
    aliasObj['picoModal'] = 'lib/picoModal';    
    config.resolve.alias = aliasObj;
    return config;
}
var sourceMappingURL = require('source-map-url');
var _ = require('lodash');
function InlineChunkPlugin (options) {
    this.options = Object.assign({ inlineChunks: []},options);
}

InlineChunkPlugin.prototype.apply = function (compiler) {
    var me = this

    compiler.plugin('compilation', function (compilation) {

        compilation.plugin('html-webpack-plugin-alter-asset-tags', (htmlPluginData, callback) => {

            var publicPath = compilation.options.output.publicPath || '';
            if (publicPath && publicPath.substr(-1) !== '/') {
                  publicPath += '/';
            }
            _.each(me.options.inlineChunks, function (name) {
                var chunkPath = (compilation.chunks.filter(function (chunk) {
                    return chunk.name === name
                })[0] || { files: [] }).files[0];
                console.log("html-webpack-inline-chunk-plugin: Inlined " + chunkPath);
                if (chunkPath) {
                    var tag = _.find(htmlPluginData.body, { attributes: { src: publicPath + chunkPath } });
                    if (tag) {
                        delete tag.attributes.src;
                        tag.innerHTML = sourceMappingURL.removeFrom(compilation.assets[chunkPath].source());
                    }
                }
            });
          callback(null, htmlPluginData);
        });
    });
}

module.exports = InlineChunkPlugin

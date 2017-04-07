var sourceMappingURL = require('source-map-url');
var _ = require('lodash');
function InlineChunkPlugin (options) {
    this.options = Object.assign({ inlineChunks: [], quiet: false }, options);
}

InlineChunkPlugin.prototype.log = function(message) {
    if (!this.options.quiet) {
      console.log(message);
    }
};

InlineChunkPlugin.prototype.apply = function (compiler) {
    var me = this;

    compiler.plugin('compilation', function (compilation) {

        compilation.plugin('html-webpack-plugin-alter-asset-tags', (htmlPluginData, callback) => {

            var publicPath = compilation.options.output.publicPath || '';
            if (publicPath && publicPath.substr(-1) !== '/') {
                publicPath += '/';
            }
            _.each(me.options.inlineChunks, function (name) {
                var chunkPath = (compilation.chunks.filter(function (chunk) {
                    return chunk.name === name;
                })[0] || { files: [] }).files[0];

                if (chunkPath) {
                    me.log("html-webpack-inline-chunk-plugin: Inlined " + chunkPath);

                    var tag = _.find(htmlPluginData.body, { attributes: { src: publicPath + chunkPath } });
                    var source = sourceMappingURL.removeFrom(compilation.assets[chunkPath].source());
                    if (tag) {
                        delete tag.attributes.src;
                        tag.innerHTML = source;
                    } else {
                        htmlPluginData.body.unshift({
                            tagName: 'script',
                            closeTag: true,
                            innerHTML: source
                        });
                    }
                }
            });
          callback(null, htmlPluginData);
        });
    });
};

module.exports = InlineChunkPlugin;

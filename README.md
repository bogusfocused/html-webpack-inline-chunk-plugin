Inline Chunk Webpack Plugin
===================

This is a [webpack](http://webpack.github.io/) plugin that inline your chunks with a script tag to save http request. Cause webpack's runtime always change between every build, it's better to split the runtime code out for long-term caching.


Installation
------------
Install the plugin with npm:
```shell
$ npm install html-webpack-inline-chunk-plugin --save-dev
```

Basic Usage
-----------

This plugin requires [HtmlWebpackPlugin](https://www.npmjs.com/package/html-webpack-plugin) v2.10.0 and above:

__Step1__: split out the runtime code
```javascript
// for explicit vendor chunk config
[
	new webpack.optimize.CommonsChunkPlugin({
		names: ['vendor', 'manifest']
	})
]

// or specify which chunk to split manually
[
	new webpack.optimize.CommonsChunkPlugin({
		name: 'manifest',
        chunks: ['...']
	})
]
```
__Step2__: config HtmlWebpackPlugin:
```javascript
[
	new HtmlWebpackPlugin({
		// your options
	})
]
```

__Step3__: config InlineManifestWebpackPlugin
```javascript
[
	new InlineChunkWebpackPlugin({
        inlineChunks: ['manifest']
	})
]
```

__Done!__
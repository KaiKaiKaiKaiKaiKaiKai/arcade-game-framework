const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = (env) => {
  console.log(env);
  return {
    entry: `./src/games/${env.gameId}/app.ts`,
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: `game.${env.gameId}.js`,
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { 
            from: path.resolve(__dirname, 'src', 'index.html'), 
            to: path.resolve(__dirname, 'dist'),
            transform(content) {
              const loadScript = `\t<script src='game.${env.gameId}.js'></script>`;
              return content.toString().replace('</body>', `${loadScript}\n</body>`);
            }
          },
          { 
            from: path.resolve(__dirname, `src/games/${env.gameId}/assets`), 
            to: path.resolve(__dirname, 'dist/assets'), 
            filter: (resourcePath) => /\.(png|jpg)$/i.test(resourcePath),
          }
        ],
      }),
      new WebpackManifestPlugin({
        fileName: 'assets-manifest.json',
        generate: (seed, files) => {
          const assetMap = {
            bundles: []
          };
          // Group files by gameId
          const bundles = {};
          files.forEach((file) => {
            // Check if the file extension is PNG or JPG
            if (!/\.(png|jpg)$/i.test(file.name)) {
              return; // Skip files with extensions other than PNG or JPG
            }
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            if (!bundles[0]) {
              bundles[0] = {
                name: 'main',
                assets: []
              };
            }
            bundles[env.gameId].assets.push({
              alias: fileName.split('-')[0].replace(/^assets\//, ''),
              src: file.path.replace(/^auto\//, '') // Remove 'auto/' prefix from source path
            });
          });
  
          // Convert bundles object to array
          Object.values(bundles).forEach((bundle) => {
            assetMap.bundles.push(bundle);
          });
  
          return assetMap;
        },
      }),
    ],
    devServer: {
      open: true,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      watchFiles: {
        paths: ['src/**/*'],
      },
      compress: true,
      port: 3000,
    },
  }
};
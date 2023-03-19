import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  entry: {
    abobo: './src/assets/js/abobo/index.js',
    specialmooove: './src/assets/js/specialmooove/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: "./assets/js/[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}
console.log(path.resolve(__dirname, 'public/assets/js'))

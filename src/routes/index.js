import fileRouter from './file.js';
import authenticate from '../auth/authenticate.js'

export default function routes(app, express) {
  app.use('/files', authenticate, fileRouter(express));

}
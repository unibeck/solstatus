import { App } from 'rwsdk';
import Document from './Document';
import './app/globals.css';
import './app/theme.css';

export default function app() {
  return (
    <App document={Document} />
  );
}
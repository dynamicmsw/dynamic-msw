import fetch from 'node-fetch';
import '@testing-library/jest-dom';

global.fetch = fetch as unknown as typeof global.fetch;

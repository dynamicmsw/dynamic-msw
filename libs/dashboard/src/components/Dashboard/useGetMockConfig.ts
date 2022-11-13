import { loadFromStorage } from '@dynamic-msw/core';
import { useEffect, useState } from 'react';

import type { MockServerSettings } from '../../types';

type MockServerSettingsStateType =
  | MockServerSettings
  | 'no-settings-found'
  | null;

const useLoadConfig = () => {
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean | null>(null);
  const [mockServerSettings, setMockServerSettings] =
    useState<MockServerSettingsStateType>(null);
  const fullHostURL = location.protocol + '//' + location.host;

  useEffect(() => {
    setIsLoadingConfig(true);
    if (mockServerSettings === null && isLoadingConfig === null) {
      import(
        /* @vite-ignore */
        `${fullHostURL}${location.pathname.replace(
          /[^/]+\.html$/,
          ''
        )}mock-server-settings.js`
      )
        .then((imported) => {
          setMockServerSettings(imported.settings);
        })
        .catch(() => {
          setMockServerSettings('no-settings-found');
        })
        .finally(() => {
          setIsLoadingConfig(false);
        });
    }
  }, []);

  return { mockServerSettings, isLoadingConfig: !mockServerSettings };
};

const useLoadIframes = (mockServerSettings: MockServerSettingsStateType) => {
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean | null>(null);
  const [iFrameError, setIframeError] = useState<false | string>(false);

  useEffect(() => {
    if (
      isLoadingIframe &&
      mockServerSettings &&
      mockServerSettings !== 'no-settings-found' &&
      (!mockServerSettings.initializePageURLs ||
        mockServerSettings.initializePageURLs.length < 0)
    ) {
      setTimeout(() => {
        setIsLoadingIframe(false);
      }, 500);
      return;
    }
    if (
      !mockServerSettings ||
      mockServerSettings === 'no-settings-found' ||
      isLoadingIframe
    ) {
      return;
    }
    setIsLoadingIframe(true);

    const loadedIframes: string[] = [];

    mockServerSettings.initializePageURLs?.forEach((url) => {
      const id = url.replace(/[^a-zA-Z0-9-_]/g, '');
      const existingEl = document.getElementById(id);
      if (existingEl) {
        loadedIframes.push(url);
        if (
          loadedIframes.length === mockServerSettings.initializePageURLs?.length
        ) {
          // Small timeout to ensure the storage is populated
          setTimeout(() => {
            setIsLoadingIframe(false);
          }, 500);
        }
        return;
      }

      const iFrameEl = document.createElement('iframe');
      iFrameEl.id = id;
      iFrameEl.src = url;
      iFrameEl.style.display = 'none';

      iFrameEl.onload = () => {
        loadedIframes.push(url);
        if (
          loadedIframes.length === mockServerSettings.initializePageURLs?.length
        ) {
          // Small timeout to ensure the storage is populated
          setTimeout(() => {
            setIsLoadingIframe(false);
          }, 500);
        }
      };

      document.body.appendChild(iFrameEl);
    });

    setTimeout(() => {
      if (isLoadingIframe) {
        setIsLoadingIframe(false);
        const iframeErrorMessage = `Failed to load iframes: ${JSON.stringify(
          mockServerSettings.initializePageURLs?.filter(
            (url) => !loadedIframes.includes(url)
          ) || []
        )}`;
        setIframeError(iframeErrorMessage);
        console.error(iframeErrorMessage);
      }
    }, 10000);
  }, [mockServerSettings]);

  return { isLoadingIframe, iFrameError };
};

export const useGetMockConfig = () => {
  const { mockServerSettings, isLoadingConfig } = useLoadConfig();
  const { isLoadingIframe, iFrameError } = useLoadIframes(mockServerSettings);

  const loadingComplete =
    mockServerSettings === 'no-settings-found' ||
    (isLoadingConfig === false && isLoadingIframe === false);

  return {
    isLoading: !loadingComplete,
    mockConfig: loadingComplete ? loadFromStorage() : null,
    iFrameError,
  };
};

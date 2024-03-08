export default function getDashboardIframe(buttonElement: HTMLButtonElement) {
  const buttonRect = buttonElement.getBoundingClientRect();
  const dashboardIframe = document.createElement('iframe');
  dashboardIframe.srcdoc = import.meta.env['VITE_DASHBOARD_HTML'];
  dashboardIframe.style.display = 'none';
  dashboardIframe.style.position = 'fixed';
  dashboardIframe.style.right = '4px';
  dashboardIframe.style.bottom = `${8 + buttonRect.height}px`;
  dashboardIframe.style.border = '0';
  dashboardIframe.style.width = '700px';
  dashboardIframe.style.maxWidth = 'calc(100% - 8px)';
  dashboardIframe.style.height = `calc(100dvh - ${20 + buttonRect.height}px)`;
  dashboardIframe.style.background = '#fff';

  dashboardIframe.style.border = 'solid 1px rgba(0,0,0,0.05)';
  dashboardIframe.style.borderRadius = '6px';
  dashboardIframe.style.boxShadow = '0px 1px 2px rgba(0,0,0,.25)';
  dashboardIframe.style.zIndex = '99999';
  return dashboardIframe;
}

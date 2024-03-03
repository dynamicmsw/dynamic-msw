import getDashboardButton from './dashboard-button';
import getDashboardIframe from './dashboard-iframe';

export const dashboardButtonWrapperId = 'dynamic-msw-dashboard-button-wrapper';

export default function injectDashboardButton(
  wrapper: HTMLElement = document.body
) {
  const existingDashboardButtonWrapper = wrapper.querySelector(
    `#${dashboardButtonWrapperId}`
  );
  if (existingDashboardButtonWrapper !== null) {
    wrapper.removeChild(existingDashboardButtonWrapper);
  }

  const dashboardButtonWrapper = document.createElement('div');
  dashboardButtonWrapper.id = dashboardButtonWrapperId;

  wrapper.appendChild(dashboardButtonWrapper);

  const dashboardButton = getDashboardButton();
  dashboardButtonWrapper.appendChild(dashboardButton);
  let dashboardIframe: HTMLIFrameElement;
  setTimeout(() => {
    dashboardIframe = getDashboardIframe(dashboardButton);
    dashboardButtonWrapper.appendChild(dashboardIframe);
  }, 1000);

  let isOpen = false;
  dashboardButton.addEventListener('click', () => {
    if (!dashboardIframe) return;
    isOpen = !isOpen;
    if (isOpen) {
      dashboardButton.textContent = 'Close';
      dashboardIframe.style.display = '';
    } else {
      dashboardButton.textContent = 'Mocks';
      dashboardIframe.style.display = 'none';
      window.location.reload();
    }
  });
}

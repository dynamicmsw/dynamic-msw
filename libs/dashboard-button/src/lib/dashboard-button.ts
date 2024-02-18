export const dashboardButtonId = 'dynamic-msw-dashboard-button-wrapper';

export default function getDashboardButton() {
  const dashboardButton = document.createElement('button');
  dashboardButton.textContent = 'Mocks';
  dashboardButton.id = dashboardButtonId;
  dashboardButton.style.cursor = 'pointer';
  dashboardButton.style.display = 'block';
  dashboardButton.style.border = '0';
  dashboardButton.style.margin = '0';
  dashboardButton.style.borderRadius = '4px';
  dashboardButton.style.outline = 'none';
  dashboardButton.style.background = '#079bf6';
  dashboardButton.style.color = 'white';
  dashboardButton.style.fontWeight = 'bold';
  dashboardButton.style.padding = '3px 10px';
  dashboardButton.style.position = 'fixed';
  dashboardButton.style.bottom = '4px';
  dashboardButton.style.right = '4px';
  dashboardButton.style.zIndex = '99999';

  return dashboardButton;
}

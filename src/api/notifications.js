import { NOTIFICATION_API } from "./config";

export const fetchNotifications = async (jwt) => {
  try {
    const response = await fetch(`${NOTIFICATION_API}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch notifications");

    // Converte a resposta para JSON
    const data = await response.json();

    return [data, null];
  } catch (error) {
    return [null, error.message];
  }
};

export const markNotificationAsRead = async (id, jwt) => {
  try {
    const response = await fetch(`${NOTIFICATION_API}/${id}/mark_as_read`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt,
      },
    });

    if (!response.ok) throw new Error("Failed to mark notification as read");

    // Converte a resposta para JSON
    const data = await response.json();

    return [data, null];
  } catch (error) {
    return [null, error.message];
  }
};
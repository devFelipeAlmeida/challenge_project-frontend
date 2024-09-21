import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "../api/notifications";
import { toast } from "react-toastify";

function Notifications() {
  const [cookies] = useCookies(["jwt"]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const fetchUserNotifications = async () => {
    const [result, error] = await fetchNotifications(cookies.jwt);
    if (error) {
      toast.error("Erro ao buscar notificações");
    } else {
      setNotifications(result.data);
    }
  };

  useEffect(() => {
    fetchUserNotifications();
  }, [cookies.jwt]);

  const handleMarkAsRead = async (notificationId) => {
    const [result, error] = await markNotificationAsRead(
      notificationId,
      cookies.jwt
    );
    if (!error) {
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } else {
      toast.error("Erro ao marcar notificação como lida");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative inline-flex items-center p-2.5 text-sm font-medium text-center text-white bg-slate-800 rounded-lg hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 16"
        >
          <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
          <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
        </svg>
        <span className="sr-only">Notifications</span>
        {notifications.length > 0 && (
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
            {notifications.length}
          </div>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg">
          <div className="scrollable-content">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-2 border-b">
                <p>{notification.message}</p>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-blue-500"
                >
                  Marcar como lida
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;

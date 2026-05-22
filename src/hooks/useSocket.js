import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { updateDriverLocation, updateDriverStatus } from '../store/slices/driverSlice';
import { updateTripStatus } from '../store/slices/tripSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      const newSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
      });

      newSocket.on('driver:locationUpdate', (data) => {
        dispatch(updateDriverLocation(data));
      });

      newSocket.on('driver:statusChange', (data) => {
        dispatch(updateDriverStatus(data));
      });

      newSocket.on('trip:statusUpdate', (data) => {
        dispatch(updateTripStatus(data));
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, token, dispatch]);

  return socket;
};

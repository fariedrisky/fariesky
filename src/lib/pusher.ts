import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Validasi environment variables
const {
  PUSHER_APP_ID,
  NEXT_PUBLIC_PUSHER_KEY,
  PUSHER_SECRET,
  NEXT_PUBLIC_PUSHER_CLUSTER
} = process.env;

if (!PUSHER_APP_ID || !NEXT_PUBLIC_PUSHER_KEY || !PUSHER_SECRET || !NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('Missing Pusher environment variables');
}

export const pusherServer = new PusherServer({
  appId: PUSHER_APP_ID,
  key: NEXT_PUBLIC_PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true
});

export const pusherClient = new PusherClient(
  NEXT_PUBLIC_PUSHER_KEY,
  {
    cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
  }
);

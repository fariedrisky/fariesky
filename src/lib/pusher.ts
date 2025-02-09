// lib/pusher.ts
import Pusher from 'pusher';
import PusherClient from 'pusher-js';

export const pusherClient = new PusherClient('7881df9de091dec71308', {
   cluster: 'ap1',
   forceTLS: true
});

export const pusherServer = new Pusher({
   appId: '1939238',
   key: '7881df9de091dec71308',
   secret: 'cf4a76303882bfa1142e', 
   cluster: 'ap1',
   useTLS: true
});

import { EventSource } from 'eventsource';

const eventSource = new EventSource(`http://localhost:8000/api/stream?message=${encodeURIComponent('AWS')}`);
eventSource.onmessage = (event) => {
  console.log('token:', event.data);
};
eventSource.onerror = () => {
  eventSource.close();
};

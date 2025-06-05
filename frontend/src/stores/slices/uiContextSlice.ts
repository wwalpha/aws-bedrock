import { apiClient } from '@/lib/apiClient';
import { UIContextSlice } from 'typings';
import { StateCreator } from 'zustand';

export const createUIContextSlice: StateCreator<UIContextSlice, [], [], UIContextSlice> = set => ({
  assistants: [],
  collections: [],
  chats: [],
  files: [],
  folders: [],
  models: [],
  presets: [],
  prompts: [],
  tools: [],
  workspaces: [],
  profile: {},

  setProfile: profile => set({ profile }),

  /**
   * Send a message to the chat or application.
   * @param message
   */
  sendMessage: async message => {
    console.log('Message sent:', message);

    apiClient().post('/message', { message });
  },

  stopMessage: () => {
    console.log('Message stopped');
  },

  newChat: () => {
    console.log('New chat created');
    return '';
  }
});

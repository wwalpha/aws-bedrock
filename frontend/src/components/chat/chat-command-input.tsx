import { ChatbotUIContext } from '@/context/context';
import { FC, useContext } from 'react';
import { AssistantPicker } from './assistant-picker';
import { usePromptAndCommand } from './chat-hooks/use-prompt-and-command';
import { FilePicker } from './FilePicker';
import { PromptPicker } from './PromptPicker';
import { ToolPicker } from './ToolPicker';

interface ChatCommandInputProps {}

export const ChatCommandInput: FC<ChatCommandInputProps> = ({}) => {
  const { newMessageFiles, chatFiles, slashCommand, isFilePickerOpen, setIsFilePickerOpen, hashtagCommand, focusPrompt, focusFile } =
    useContext(ChatbotUIContext);

  const { handleSelectUserFile, handleSelectUserCollection } = usePromptAndCommand();

  return (
    <>
      <PromptPicker />

      <FilePicker
        isOpen={isFilePickerOpen}
        searchQuery={hashtagCommand}
        onOpenChange={setIsFilePickerOpen}
        selectedFileIds={[...newMessageFiles, ...chatFiles].map(file => file.id)}
        selectedCollectionIds={[]}
        onSelectFile={handleSelectUserFile}
        onSelectCollection={handleSelectUserCollection}
        isFocused={focusFile}
      />

      <ToolPicker />

      <AssistantPicker />
    </>
  );
};

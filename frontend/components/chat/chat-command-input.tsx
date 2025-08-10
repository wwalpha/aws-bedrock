import { useChatStore } from "@/store"
import { FC } from "react"
import { AssistantPicker } from "./assistant-picker"
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command"
import { FilePicker } from "./file-picker"
import { PromptPicker } from "./prompt-picker"
import { ToolPicker } from "./tool-picker"

interface ChatCommandInputProps {}

export const ChatCommandInput: FC<ChatCommandInputProps> = ({}) => {
  const newMessageFiles = useChatStore(s => s.newMessageFiles)
  const chatFiles = useChatStore(s => s.chatFiles)
  const slashCommand = useChatStore(s => s.slashCommand)
  const isFilePickerOpen = useChatStore(s => s.isFilePickerOpen)
  const setIsFilePickerOpen = useChatStore(s => s.setIsFilePickerOpen)
  const hashtagCommand = useChatStore(s => s.hashtagCommand)
  const focusPrompt = useChatStore(s => s.focusPrompt)
  const focusFile = useChatStore(s => s.focusFile)

  const { handleSelectUserFile, handleSelectUserCollection } =
    usePromptAndCommand()

  return (
    <>
      <PromptPicker />

      <FilePicker
        isOpen={isFilePickerOpen}
        searchQuery={hashtagCommand}
        onOpenChange={setIsFilePickerOpen}
        selectedFileIds={[...newMessageFiles, ...chatFiles].map(
          file => file.id
        )}
        selectedCollectionIds={[]}
        onSelectFile={handleSelectUserFile}
        onSelectCollection={handleSelectUserCollection}
        isFocused={focusFile}
      />

      <ToolPicker />

      <AssistantPicker />
    </>
  )
}

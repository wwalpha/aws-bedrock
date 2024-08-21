import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  useEffect,
} from 'react';
import { BaseProps } from '../@types/common';
import ExpandableMenu from './ExpandableMenu';
import {
  PiBookOpenText,
  PiFlask,
  PiTrash,
  PiPencilLine,
  PiCheck,
  PiX,
} from 'react-icons/pi';
import { ChatPageQueryParams } from '../@types/navigate';
import useChat from '../hooks/useChat';
import { getPrompter, PromptListItem } from '../prompts';
import type { PromptList } from '../prompts';
import ButtonIcon from './ButtonIcon';
import { SystemContext } from 'typings';

type Props = BaseProps & {
  onClick: (params: ChatPageQueryParams) => void;
  systemContextList: SystemContext[];
  onClickDeleteSystemContext: (systemContextId: string) => Promise<void>;
  onClickUpdateSystemContext: (
    systemContextId: string,
    title: string
  ) => Promise<void>;
};

const PromptList: React.FC<Props> = (props) => {
  const { onClick, onClickDeleteSystemContext, onClickUpdateSystemContext } =
    props;
  const [expanded, setExpanded] = useState(false);
  // PromptList はチャットのページでの利用に固定
  const { getModelId } = useChat('/chat');
  const modelId = getModelId();

  const prompter = useMemo(() => {
    return getPrompter(modelId);
  }, [modelId]);

  // 上位の setExpanded にアクセスするためにコンポーネントをネストする
  const Item: React.FC<PromptListItem> = (props) => {
    const onClickPrompt = useCallback(() => {
      onClick({
        systemContext: props.systemContext,
        content: props.prompt,
      });

      setExpanded(false);
    }, [props]);

    return (
      <li
        className="my-2 cursor-pointer hover:underline"
        onClick={onClickPrompt}>
        {props.title}
      </li>
    );
  };
  const SystemContextItem: React.FC<
    Omit<SystemContext, 'id' | 'createdDate'>
  > = (props) => {
    const [editing, setEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (editing) {
        setTempTitle(props.systemContextTitle);
      }
    }, [editing, props.systemContextTitle]);

    useLayoutEffect(() => {
      if (editing) {
        const listener = (e: DocumentEventMap['keypress']) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            setEditing(false);
            onClickUpdateSystemContext(props.systemContextId, tempTitle).catch(
              () => {
                setEditing(true);
              }
            );
          }
        };
        inputRef.current?.addEventListener('keypress', listener);
        inputRef.current?.focus();

        return () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          inputRef.current?.removeEventListener('keypress', listener);
        };
      }
    }, [editing, props.systemContextId, tempTitle]);

    const onClickPrompt = useCallback(() => {
      onClick({
        systemContext: props.systemContext,
      });

      setExpanded(false);
    }, [props]);

    return (
      <li className="flex items-center">
        {editing ? (
          <>
            <input
              ref={inputRef}
              type="text"
              className="max-h-5 w-full bg-transparent p-0 text-sm ring-0"
              value={tempTitle}
              onChange={(e) => {
                setTempTitle(e.target.value);
              }}
            />
            <ButtonIcon
              onClick={() => {
                setEditing(false);
                onClickUpdateSystemContext(
                  props.systemContextId,
                  tempTitle
                ).catch(() => {
                  setEditing(true);
                });
              }}>
              <PiCheck />
            </ButtonIcon>
            <ButtonIcon
              onClick={() => {
                setEditing(false);
              }}>
              <PiX />
            </ButtonIcon>
          </>
        ) : (
          <>
            <div
              className="grow cursor-pointer truncate hover:underline"
              onClick={onClickPrompt}>
              {props.systemContextTitle}
            </div>
            <ButtonIcon
              onClick={() => {
                setEditing(true);
              }}>
              <PiPencilLine />
            </ButtonIcon>
            <ButtonIcon
              onClick={() => {
                onClickDeleteSystemContext(props.systemContextId);
              }}>
              <PiTrash />
            </ButtonIcon>
          </>
        )}
      </li>
    );
  };

  return (
    <>
      {expanded && (
        <div
          className={`${props.className} fixed left-0 top-0 z-20 h-screen w-screen bg-gray-900/90`}
          onClick={() => {
            setExpanded(false);
          }}
        />
      )}

      <div
        className={`fixed top-0 transition-all ${
          expanded ? 'right-0 z-50' : '-right-64 z-30'
        } pointer-events-none flex h-full justify-center`}>
        <div
          className="bg-aws-smile pointer-events-auto mt-16 flex size-12 cursor-pointer items-center justify-center rounded-l-full"
          onClick={() => {
            setExpanded(!expanded);
          }}>
          <PiBookOpenText className="text-aws-squid-ink size-6" />
        </div>

        <div className="bg-aws-squid-ink scrollbar-thin scrollbar-thumb-white pointer-events-auto h-full w-64 overflow-y-scroll break-words p-3 text-sm text-white">
          <div className="my-2 flex items-center text-sm font-semibold">
            <PiBookOpenText className="mr-1.5 text-lg" />
            保存したシステムコンテキスト
          </div>
          <ul className="pl-6">
            {props.systemContextList.length == 0 && (
              <li className="text-gray-400">ありません</li>
            )}
            {props.systemContextList.length > 0 &&
              props.systemContextList.map((item, i) => {
                return (
                  <SystemContextItem
                    systemContextTitle={item.systemContextTitle}
                    systemContext={item.systemContext}
                    systemContextId={item.systemContextId}
                    key={i}
                  />
                );
              })}
          </ul>

          <div className="mb-2 mt-4 flex items-center text-sm font-semibold">
            <PiBookOpenText className="mr-1.5 text-lg" />
            プロンプト例
          </div>

          {prompter.promptList().map((category, i) => {
            return (
              <ExpandableMenu
                title={category.title}
                className="my-2 ml-2"
                defaultOpened={false}
                icon={category.experimental && <PiFlask />}
                key={`${i}`}>
                <ul className="pl-4">
                  {category.items.map((item, j) => {
                    return (
                      <Item
                        title={item.title}
                        systemContext={item.systemContext}
                        prompt={item.prompt}
                        key={`${i}-${j}`}
                      />
                    );
                  })}
                </ul>
              </ExpandableMenu>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PromptList;

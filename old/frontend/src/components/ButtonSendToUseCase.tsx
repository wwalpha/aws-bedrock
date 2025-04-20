import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import ButtonIcon from './ButtonIcon';
import { BaseProps } from '../@types/common';
import { PiPaperPlaneRight } from 'react-icons/pi';
import ModalDialog from './ModalDialog';

type UseCaseItemProps = BaseProps & {
  title: string;
  path: string;
  queryKey: string;
  text: string;
  onClose: () => void;
};

const UseCaseItem: React.FC<UseCaseItemProps> = (props) => {
  const navigate = useNavigate();

  return (
    <li
      className="cursor-pointer px-1 py-2 hover:bg-gray-300"
      onClick={() => {
        props.onClose();
        navigate(
          `${props.path}?${queryString.stringify({ [props.queryKey]: props.text })}`
        );
      }}>
      {props.title}
    </li>
  );
};

type Props = BaseProps & {
  text: string;
};

const ButtonSendToUseCase: React.FC<Props> = (props) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ButtonIcon
        className={`${props.className ?? ''}`}
        onClick={() => {
          setShowModal(true);
        }}>
        {<PiPaperPlaneRight />}
      </ButtonIcon>

      {showModal && (
        <div
          className="fixed left-0 top-0 z-20 h-screen w-screen bg-gray-900/90"
          onClick={() => {
            setShowModal(false);
          }}>
          <ModalDialog
            isOpen={showModal}
            title="ユースケースを選択"
            onClose={() => {
              setShowModal(false);
            }}>
            <ul>
              <UseCaseItem
                path="/chat"
                queryKey="content"
                text={props.text}
                title="チャット"
                onClose={() => {
                  setShowModal(false);
                }}
              />
              <UseCaseItem
                path="/generate"
                queryKey="information"
                text={props.text}
                title="文章生成"
                onClose={() => {
                  setShowModal(false);
                }}
              />
              <UseCaseItem
                path="/summarize"
                queryKey="sentence"
                text={props.text}
                title="要約"
                onClose={() => {
                  setShowModal(false);
                }}
              />
              <UseCaseItem
                path="/editorial"
                queryKey="sentence"
                text={props.text}
                title="校正"
                onClose={() => {
                  setShowModal(false);
                }}
              />
              <UseCaseItem
                path="/translate"
                queryKey="sentence"
                text={props.text}
                title="翻訳"
                onClose={() => {
                  setShowModal(false);
                }}
              />
            </ul>
          </ModalDialog>
        </div>
      )}
    </>
  );
};

export default ButtonSendToUseCase;

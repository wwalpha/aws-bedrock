import { ChatbotUISVG } from '@/components/icons/chatbotui-svg';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <div>
        <ChatbotUISVG scale={0.3} />
      </div>

      <div className="mt-2 text-4xl font-bold">Chatbot UI</div>

      <Button
        className="mt-4 flex w-[200px] items-center justify-center bg-blue-500 p-2 font-semibold"
        onClick={() => navigate('/login')}
      >
        Start Chatting
        <ArrowRight className="ml-1" size={20} />
      </Button>
    </div>
  );
}

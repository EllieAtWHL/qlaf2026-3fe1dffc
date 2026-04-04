import { motion } from 'framer-motion';
import { useQuizStore } from '@/store/quizStore';
import { Clock, Image } from 'lucide-react';

interface BoardSelectionProps {
  title: string;
  boards: Array<{
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
  }>;
  onSelectBoard: (boardId: string) => void;
  boardType: 'picture-board' | 'one-minute-round';
}

export const BoardSelection = ({ 
  title, 
  boards, 
  onSelectBoard, 
  boardType 
}: BoardSelectionProps) => {
  const { availableBoards, pictureBoards, oneMinuteBoards } = useQuizStore();

  const getBoards = () => {
    if (boardType === 'picture-board') {
      return availableBoards.map(boardId => 
        pictureBoards.find(board => board.id === boardId)
      ).filter(Boolean);
    }
    
    if (boardType === 'one-minute-round') {
      return availableBoards.map(boardId => 
        oneMinuteBoards.find(board => board.id === boardId)
      ).filter(Boolean);
    }
    
    return [];
  };

  const boardItems = getBoards();

  console.log('BoardSelection Debug:', {
    boardType,
    availableBoardsLength: availableBoards.length,
    oneMinuteBoardsLength: oneMinuteBoards.length,
    pictureBoardsLength: pictureBoards.length,
    boardItemsLength: boardItems.length
  });
  
  console.log('BoardSelection - availableBoards:', availableBoards);
  console.log('BoardSelection - boardItems count:', boardItems.length);

  return (
    <div className="space-y-3">
      <h3 className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        {title}
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {boardItems.map((board) => (
          <motion.div
            key={board.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectBoard(board.id)}
            className="p-12 bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 hover:border-white/40 transition-all hover:shadow-2xl hover:bg-white/20 cursor-pointer"
          >
            <div className="text-center">
              {boardType === 'picture-board' ? (
                <>
                  <img 
                    src={(board as any)?.imageUrl || "/images/picture-board/default.jpg"} 
                    className="w-32 h-32 mx-auto mb-8 text-white rounded-xl shadow-xl" 
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <h3 className="font-bold text-2xl mb-3 text-white">{board.name}</h3>
                </>
              ) : (
                <>
                  <img 
                    src={(board as any)?.imageUrl || "/placeholder.svg"} 
                    className="w-32 h-32 mx-auto mb-8 text-white rounded-xl shadow-xl" 
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <h3 className="font-bold text-2xl mb-3 text-white">{board.name}</h3>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

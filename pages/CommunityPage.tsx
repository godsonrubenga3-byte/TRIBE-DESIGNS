
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, Star, Image as ImageIcon } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface Post {
  id: number;
  author: string;
  handle: string;
  avatar: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Kofi Mensah",
    handle: "@kofi_design",
    avatar: "https://i.pravatar.cc/150?img=11",
    timestamp: "2h ago",
    content: "Just received my Custom Kente Shift jersey! The quality is insane. The AI suggestion was spot on with the color palette. 🌍🔥 #TribeDesigns",
    image: "https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&q=80&w=800",
    likes: 136,
    isLiked: false,
    comments: [
      { id: 'c1', author: "Tribe Official", text: "Looking sharp! Welcome to the family 👑", timestamp: "1h ago" },
      { id: 'c2', author: "@zulu_tech", text: "Need this exact colorway.", timestamp: "45m ago" }
    ]
  },
  {
    id: 2,
    author: "Chioma Okonjo",
    handle: "@naija_prince",
    avatar: "https://i.pravatar.cc/150?img=33",
    timestamp: "4h ago",
    content: "Anyone going to the Lagos pop-up next week? Let's link up at 54 Street booth! I'll be wearing the new Heritage Pack.",
    likes: 89,
    isLiked: true,
    comments: []
  },
  {
    id: 3,
    author: "Sipho Dlamini",
    handle: "@zulu_tech",
    avatar: "https://i.pravatar.cc/150?img=59",
    timestamp: "6h ago",
    content: "Thinking about a fusion piece combining Maasai beads with modern tech-fleece. Needs to be breathable for the summer though. Thoughts?",
    likes: 245,
    isLiked: false,
    comments: [
       { id: 'c3', author: "@kofi_design", text: "Would cop immediately.", timestamp: "5h ago" }
    ]
  }
];

const PostItem: React.FC<{ post: Post; onLike: (id: number) => void; onComment: (id: number, text: string) => void }> = ({ post, onLike, onComment }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");

    const handleCommentSubmit = () => {
        if (!commentText.trim()) return;
        onComment(post.id, commentText);
        setCommentText("");
        if (!showComments) setShowComments(true);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden border-2 border-amber-500 p-0.5">
                    <img src={post.avatar} alt={post.author} className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                    <h4 className="font-bold text-base md:text-lg leading-none mb-1 text-zinc-900 dark:text-zinc-100">{post.handle}</h4>
                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">{post.timestamp}</span>
                </div>
            </div>
            
            <p className="mb-6 text-zinc-700 dark:text-zinc-300 font-medium text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
            </p>
            
            {post.image && (
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-6 overflow-hidden">
                    <img src={post.image} className="w-full h-full object-cover" alt="Post attachment" />
                </div>
            )}
            
            <div className="flex gap-8 text-zinc-400 font-bold text-[10px] md:text-xs uppercase tracking-widest pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-amber-500' : 'hover:text-amber-500'}`}
                >
                    <ThumbsUp size={18} className={post.isLiked ? "fill-amber-500" : ""} /> 
                    {post.likes} Likes
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-2 transition-colors ${showComments ? 'text-amber-500' : 'hover:text-amber-500'}`}
                >
                    <MessageSquare size={18} /> 
                    {post.comments.length} Comments
                </button>
            </div>

            {/* Comments Section */}
            {(showComments) && (
                 <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                    {post.comments.length > 0 && (
                        <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-4 space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                            {post.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-zinc-500">
                                        {comment.author.substring(1, 3).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{comment.author}</span>
                                            <span className="text-[10px] text-zinc-500">{comment.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Add Comment Input */}
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                            placeholder="Add a comment..."
                            className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 dark:text-white dark:placeholder:text-zinc-600 outline-none"
                        />
                        <button 
                            onClick={handleCommentSubmit}
                            disabled={!commentText.trim()}
                            className="p-3 bg-amber-500 text-black rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                 </div>
            )}
        </div>
    );
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState("");
  const [councilFeedback, setCouncilFeedback] = useState('');
  const [councilSubmitted, setCouncilSubmitted] = useState(false);

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    
    const newPost: Post = {
        id: Date.now(),
        author: "You",
        handle: "@new_member",
        avatar: "https://i.pravatar.cc/150?img=12", // Default placeholder
        timestamp: "Just now",
        content: newPostText,
        likes: 0,
        isLiked: false,
        comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(post => {
        if (post.id === id) {
            return {
                ...post,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked
            };
        }
        return post;
    }));
  };

  const handleAddComment = (postId: number, text: string) => {
    setPosts(posts.map(post => {
        if (post.id === postId) {
            const newComment: Comment = {
                id: `c-${Date.now()}`,
                author: "@new_member",
                text: text,
                timestamp: "Just now"
            };
            return {
                ...post,
                comments: [...post.comments, newComment]
            };
        }
        return post;
    }));
  };

  const handleCouncilSubmit = () => {
    if(councilFeedback.trim()) {
        setCouncilSubmitted(true);
        setCouncilFeedback('');
        setTimeout(() => setCouncilSubmitted(false), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-12 md:pt-20">
       {/* Hero */}
       <div className="bg-amber-500 py-16 md:py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <span className="inline-block px-4 py-1.5 bg-black text-white text-[10px] font-black tracking-widest uppercase rounded-full mb-6">Access Granted: Member #3421</span>
            <h1 className="text-4xl md:text-9xl font-syne font-black mb-4 md:mb-6 uppercase tracking-tighter leading-none text-black">THE 54 STREET</h1>
            <p className="text-base md:text-2xl font-bold max-w-2xl mx-auto text-black/80">
                Welcome to the inner circle. Where culture meets street, and the tribe shapes the future.
            </p>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8 order-2 lg:order-1">
             <div className="flex items-center justify-between mb-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <h2 className="text-2xl md:text-3xl font-syne font-black uppercase">Community Feed</h2>
                <div className="flex gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] md:text-xs font-bold uppercase text-zinc-500 tracking-widest">Live Now</span>
                </div>
             </div>

             {/* Create Post Input */}
             <div className="bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full flex-shrink-0 overflow-hidden">
                        <img src="https://i.pravatar.cc/150?img=12" alt="You" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <textarea 
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            placeholder="What's on your mind? Share your designs..." 
                            className="w-full bg-transparent border-b-2 border-zinc-100 dark:border-zinc-800 focus:border-amber-500 outline-none p-2 text-base md:text-lg font-medium resize-none transition-colors dark:text-white placeholder:text-zinc-500"
                            rows={2}
                        />
                        <div className="flex justify-between items-center">
                            <button className="text-zinc-400 hover:text-amber-500 transition-colors p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <ImageIcon size={20} />
                            </button>
                            <button 
                                onClick={handleCreatePost}
                                disabled={!newPostText.trim()}
                                className="bg-black dark:bg-white text-white dark:text-black px-4 md:px-6 py-2 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-amber-500 hover:text-black dark:hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Post Update
                            </button>
                        </div>
                    </div>
                </div>
             </div>

             {/* Posts Feed */}
             <div className="space-y-6">
                {posts.map((post) => (
                    <PostItem 
                        key={post.id} 
                        post={post} 
                        onLike={handleLike} 
                        onComment={handleAddComment} 
                    />
                ))}
             </div>
          </div>

          {/* Sidebar: Feedback & Ideas */}
          <div className="space-y-8 lg:sticky lg:top-24 h-fit order-1 lg:order-2">
             <div className="bg-black dark:bg-zinc-900 text-white p-6 md:p-8 rounded-[2rem] relative overflow-hidden border border-zinc-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                <div className="relative z-10">
                   <h3 className="text-2xl md:text-3xl font-syne font-black mb-2 uppercase text-amber-500">The Council</h3>
                   <p className="text-zinc-400 text-xs md:text-sm mb-8 font-medium leading-relaxed">
                       You are now part of the decision making process. Rate your experience and drop ideas for the next collection.
                   </p>
                   
                   <div className="space-y-4">
                      <textarea 
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white resize-none placeholder:text-zinc-500 transition-all"
                        rows={5}
                        placeholder="What should we build next? Or how can we improve?"
                        value={councilFeedback}
                        onChange={(e) => setCouncilFeedback(e.target.value)}
                      />
                      <button 
                        onClick={handleCouncilSubmit}
                        disabled={councilSubmitted}
                        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            councilSubmitted ? 'bg-green-500 text-white' : 'bg-amber-500 text-black hover:bg-amber-400 hover:scale-[1.02] shadow-lg'
                        }`}
                      >
                         {councilSubmitted ? 'Sent!' : 'Submit Idea'} <Send size={16} className={councilSubmitted ? 'hidden' : ''} />
                      </button>
                   </div>
                </div>
             </div>

             <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-lg mb-6 uppercase flex items-center gap-2 tracking-wide text-zinc-900 dark:text-zinc-100">
                   <Star className="text-amber-500 fill-amber-500" size={20} />
                   Top Contributors
                </h3>
                <div className="space-y-6">
                   {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-sm text-zinc-400">
                            {i}
                         </div>
                         <div className="flex-1">
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Member_{999-i}</h4>
                            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-2">
                                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${100 - i * 15}%` }}></div>
                            </div>
                         </div>
                         <span className="text-[10px] font-black uppercase text-amber-500">{2000 - i * 350} XP</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CommunityPage;

import { useEffect, useState } from "react";
import axios from "@/utils/axios.instance";
import { 
  Loader2, 
  Trash2, 
  Reply, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Clock,
  User,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";

const Messages = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  // Expanded message state
  const [expandedMessage, setExpandedMessage] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/message/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data || []);
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  function refresh() {
    fetchMessages();
    setCurrentPage(1);
    setExpandedMessage(null);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/message/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Message deleted!");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expandedMessage === id) {
        setExpandedMessage(null);
      }
    } catch {
      toast.error("Failed to delete message.");
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      setSending(true);
      await axios.post(`/message/replyMessage/${id}`, { reply: replyText }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Reply sent!");
      setReplyText("");
      setReplyingTo(null);
      fetchMessages();
    } catch (error) {
      console.log(error);
      toast.error("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = messages.slice(startIndex, startIndex + itemsPerPage);

  const toggleMessage = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
    setReplyingTo(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading messages...
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans text-foreground space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Messages Management
          </h1>
          <p className="text-muted-foreground">Manage customer inquiries and responses</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Messages Count */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Total Messages: {messages.length}
            </span>
          </div>
          {messages.length > 0 && (
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
      </div>

      {paginatedMessages.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No messages found</h3>
          <p className="text-muted-foreground">All customer messages will appear here</p>
        </div>
      ) : (
        <>
          {/* Messages List */}
          <div className="space-y-4">
            {paginatedMessages.map((msg) => (
              <div
                key={msg.id}
                className="border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Message Summary - Always Visible */}
                <div 
                  className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                  onClick={() => toggleMessage(msg.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary mt-1">
                        {msg.first_name[0]}
                        {msg.last_name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-lg">
                            {msg.first_name} {msg.last_name}
                          </h3>
                          {msg.reply && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Replied
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{msg.email}</p>
                        {msg.subject && (
                          <p className="font-medium text-foreground mb-2">
                            {msg.subject}
                          </p>
                        )}
                        <p className="text-sm text-foreground line-clamp-2">
                          {msg.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(msg.created_at)}
                          </div>
                          {msg.reply && (
                            <div className="flex items-center gap-1">
                              <Reply className="w-3 h-3" />
                              Replied {formatDate(msg.replied_at)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {expandedMessage === msg.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Message Content - Only shown when expanded */}
                {expandedMessage === msg.id && (
                  <div className="border-t border-border p-6 space-y-6 bg-accent/5">
                    {/* Original Message */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Original Message
                      </h4>
                      <div className="bg-background border border-border rounded-lg p-4">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    </div>

                    {/* Reply Section (if exists) */}
                    {msg.reply && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Your Reply
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                            {msg.reply}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2 text-right">
                            Replied on {formatDate(msg.replied_at)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Reply Input */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        {msg.reply ? "Update Reply" : "Send Reply"}
                      </h4>
                      <div className="space-y-3">
                        <textarea
                          className="w-full border border-border rounded-lg p-4 bg-background text-foreground resize-none focus:ring-2 focus:ring-primary/20 outline-none min-h-[120px]"
                          placeholder="Write your reply here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(msg.id)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setReplyText("");
                                setReplyingTo(null);
                              }}
                              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              disabled={sending || !replyText.trim()}
                              onClick={() => handleReply(msg.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {sending ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Reply className="w-4 h-4" />
                                  {msg.reply ? "Update Reply" : "Send Reply"}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, messages.length)} of {messages.length} messages
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === page 
                          ? 'bg-primary text-primary-foreground' 
                          : 'border border-border hover:bg-accent'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Messages;
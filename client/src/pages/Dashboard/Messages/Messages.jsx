import { useEffect, useState } from "react";
import axios from "@/utils/axios.instance";
import { Loader2, Trash2, Reply, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/message/messages");
      setMessages(res.data || []);
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };
  function refresh() {
    fetchMessages()
  }
  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/message/delete/${id}`);
      toast.success("Message deleted!");
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error("Failed to delete message.");
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      setSending(true);
      await axios.post(`/message/replyMessage/${id}`, { reply: replyText });
      toast.success("Reply sent!");
      setReplyText("");
      setReplyingTo(null);
      fetchMessages();
    } catch {
      toast.error("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading messages...
      </div>
    );

  const visibleMessages = messages.slice(0, visibleCount);

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans text-foreground space-y-6">
      <div className="flex justify-between align-middle">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Messages Management
      </h1>
      <RotateCcw onClick={refresh} className=""/>
      </div>

      {visibleMessages.length === 0 ? (
        <p className="text-center text-muted-foreground">No messages found.</p>
      ) : (
        visibleMessages.map((msg) => (
          <div
            key={msg.id}
            className="border border-border rounded-xl bg-card shadow-sm p-4 space-y-4"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {msg.first_name[0]}
                  {msg.last_name[0]}
                </div>
                <div>
                  <h3 className="font-medium">
                    {msg.first_name} {msg.last_name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{msg.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === msg.id ? null : msg.id)
                  }
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Reply className="w-4 h-4" /> Reply
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>

            {/* Message + Reply */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-secondary text-foreground p-3 rounded-2xl rounded-bl-none">
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 text-right">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {msg.reply && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-violet-100 text-foreground p-3 rounded-2xl rounded-br-none">
                    <p className="text-sm leading-relaxed">{msg.reply}</p>
                    <p className="text-[11px] opacity-80 mt-1 text-right">
                      {new Date(msg.replied_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

           {replyingTo === msg.id && (
            <div className="flex justify-end mt-3">
              <div className="w-[80%] flex flex-col gap-2">
                <textarea
                  className="border border-border rounded-md p-2 bg-popover text-foreground text-sm resize-none focus:ring-1 focus:ring-ring outline-none"
                  rows={3}
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    disabled={sending}
                    onClick={() => handleReply(msg.id)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition disabled:opacity-70"
                  >
                    {sending ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            </div>
          )}
            </div>
          </div>
        ))
      )}

      {visibleCount < messages.length && (
        <div className="text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="px-6 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition text-sm font-medium"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Messages;

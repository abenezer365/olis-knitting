import React, { useState } from 'react';
import CSS from './Messages.module.css';

const Messages = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      subject: 'Partnership Inquiry',
      message: 'Hello! I represent a tech startup and would like to discuss potential partnership opportunities with your company. We believe our products complement each other well and could create great value for both our customers.',
      timestamp: '2024-01-15 14:30',
      read: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Sarah Miller',
      email: 'sarah.m@creative.com',
      subject: 'Product Feedback',
      message: 'I\'ve been using your service for 3 months now and wanted to share some feedback. The dashboard is amazing but I think the mobile app could use some improvements in the navigation flow.',
      timestamp: '2024-01-14 11:20',
      read: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@techcorp.com',
      subject: 'Technical Support Needed',
      message: 'We\'re experiencing some API integration issues with your platform. The authentication seems to be timing out after 30 minutes. Can you help us resolve this?',
      timestamp: '2024-01-14 09:45',
      read: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.r@designstudio.com',
      subject: 'Collaboration Request',
      message: 'Love your work! We\'re organizing a design conference next month and would be honored if you could join us as a speaker. The theme is "Future of Digital Experiences".',
      timestamp: '2024-01-13 16:15',
      read: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'David Kim',
      email: 'david.kim@startup.io',
      subject: 'Pricing Question',
      message: 'I\'m interested in your enterprise plan but had some questions about the custom features. Do you offer trial periods for enterprise clients?',
      timestamp: '2024-01-12 13:30',
      read: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    }
  ]);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = (messageId) => {
    if (replyingTo === messageId) {
      // Send reply logic would go here
      console.log('Sending reply:', replyText);
      setReplyingTo(null);
      setReplyText('');
      
      // Mark as read when replying
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } else {
      setReplyingTo(messageId);
      setReplyText('');
    }
  };

  const handleMarkAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const handleDelete = (messageId) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={CSS.messagesContainer}>
      <header className={CSS.header}>
        <div className={CSS.headerContent}>
          <h1 className={CSS.title}>Messages</h1>
          <div className={CSS.stats}>
            <span className={CSS.unreadCount}>
              {messages.filter(msg => !msg.read).length} unread
            </span>
            <span className={CSS.totalCount}>
              {messages.length} total
            </span>
          </div>
        </div>
        <p className={CSS.subtitle}>Customer inquiries and feedback</p>
      </header>

      <div className={CSS.messagesList}>
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`${CSS.messageCard} ${!message.read ? CSS.unread : ''} ${
              replyingTo === message.id ? CSS.expanded : ''
            }`}
          >
            <div className={CSS.messageHeader}>
              <div className={CSS.userInfo}>
                <img 
                  src={message.avatar} 
                  alt={message.name}
                  className={CSS.avatar}
                />
                <div className={CSS.userDetails}>
                  <h3 className={CSS.userName}>{message.name}</h3>
                  <p className={CSS.userEmail}>{message.email}</p>
                </div>
              </div>
              
              <div className={CSS.messageMeta}>
                <span className={CSS.timestamp}>
                  {formatTime(message.timestamp)}
                </span>
                {!message.read && <div className={CSS.unreadDot}></div>}
              </div>
            </div>

            <div className={CSS.messageContent}>
              <h4 className={CSS.subject}>{message.subject}</h4>
              <p className={CSS.messageText}>{message.message}</p>
            </div>

            <div className={CSS.actionBar}>
              <button 
                className={`${CSS.actionButton} ${CSS.replyButton}`}
                onClick={() => handleReply(message.id)}
              >
                {replyingTo === message.id ? 'Send Reply' : 'Reply'}
              </button>
              
              {!message.read && (
                <button 
                  className={`${CSS.actionButton} ${CSS.readButton}`}
                  onClick={() => handleMarkAsRead(message.id)}
                >
                  Mark Read
                </button>
              )}
              
              <button 
                className={`${CSS.actionButton} ${CSS.deleteButton}`}
                onClick={() => handleDelete(message.id)}
              >
                Delete
              </button>
            </div>

            {replyingTo === message.id && (
              <div className={CSS.replySection}>
                <textarea
                  className={CSS.replyInput}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows="4"
                />
                <div className={CSS.replyActions}>
                  <button 
                    className={`${CSS.actionButton} ${CSS.cancelButton}`}
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={`${CSS.actionButton} ${CSS.sendButton}`}
                    onClick={() => handleReply(message.id)}
                    disabled={!replyText.trim()}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
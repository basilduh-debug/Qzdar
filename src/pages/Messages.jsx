import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";

function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [otherUserId, setOtherUserId] = useState(searchParams.get("to") || "");
  const [otherUserName, setOtherUserName] = useState("");
  const [conversations, setConversations] = useState([]);
  const [chat, setChat] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const loadInbox = async () => {
    try {
      const data = await api("/messages/inbox");
      setConversations(data);
    } catch (err) {
      setError(err.message || "Could not load inbox");
    }
  };

  const loadChat = async (withUserId) => {
    if (!withUserId) {
      setChat([]);
      setOtherUserName("");
      return;
    }
    try {
      const data = await api("/messages/with/" + withUserId);
      setChat(data);

      // Set the other user's display name based on the conversation
      if (data.length > 0) {
        const sample = data[0];
        const name = String(sample.from._id) === user.id ? sample.to.username : sample.from.username;
        setOtherUserName(name);
      } else {
        // No messages yet - try to find the name from the inbox if available
        const fromInbox = conversations.find(c => String(c.id) === String(withUserId));
        setOtherUserName(fromInbox?.name || "Unknown user");
      }
    } catch (err) {
      setError(err.message || "Could not load conversation");
    }
  };

  useEffect(() => {
    loadInbox();
  }, [user]);

  useEffect(() => {
    loadChat(otherUserId);
  }, [otherUserId, conversations]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!otherUserId || !text.trim()) return;

    try {
      await api("/messages", {
        method: "POST",
        body: JSON.stringify({ to: otherUserId, text: text.trim() })
      });
      setText("");
      loadChat(otherUserId);
      loadInbox();
    } catch (err) {
      setError(err.message || "Could not send message");
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Messages</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Inbox column */}
        <div style={{ flex: '1 1 250px', padding: '15px', border: '1px solid #ccc', borderRadius: '6px' }}>
          <h3 style={{ marginTop: 0 }}>Conversations</h3>
          {conversations.length === 0 && <p style={{ color: '#666' }}>No conversations yet.</p>}
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => setOtherUserId(c.id)}
              style={{
                padding: '10px',
                marginBottom: '8px',
                background: otherUserId === c.id ? '#e7f1ff' : '#f8f9fa',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{c.name}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {c.lastMessage.length > 30 ? c.lastMessage.substring(0, 30) + '...' : c.lastMessage}
              </div>
            </div>
          ))}
        </div>

        {/* Chat column */}
        <div style={{ flex: '2 1 400px', padding: '15px', border: '1px solid #ccc', borderRadius: '6px' }}>
          {!otherUserId ? (
            <p style={{ color: '#666' }}>Pick a conversation, or start one from a stadium page or a reservation.</p>
          ) : (
            <>
              <h3 style={{ marginTop: 0 }}>Chatting with {otherUserName}</h3>
              <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '15px', padding: '10px', background: '#fafafa', borderRadius: '4px' }}>
                {chat.length === 0 && <p style={{ color: '#666' }}>No messages yet. Say hi!</p>}
                {chat.map(m => (
                  <div
                    key={m._id}
                    style={{
                      textAlign: String(m.from._id) === user.id ? 'right' : 'left',
                      margin: '6px 0'
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: String(m.from._id) === user.id ? '#007bff' : '#e0e0e0',
                        color: String(m.from._id) === user.id ? 'white' : 'black',
                        maxWidth: '70%'
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  style={{ flex: 1, padding: '8px', boxSizing: 'border-box' }}
                />
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;

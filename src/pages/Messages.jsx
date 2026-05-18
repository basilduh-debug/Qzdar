import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { api } from "../api";
import { colors, page, card, button, input } from "../theme";

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
      setError(err.message);
    }
  };

  const loadChat = async (withUserId) => {
    if (!withUserId) { setChat([]); setOtherUserName(""); return; }
    try {
      const data = await api("/messages/with/" + withUserId);
      setChat(data);

      if (data.length > 0) {
        const sample = data[0];
        const name = String(sample.from._id) === user.id ? sample.to.username : sample.from.username;
        setOtherUserName(name);
      } else {
        const fromInbox = conversations.find(c => String(c.id) === String(withUserId));
        setOtherUserName(fromInbox?.name || "Unknown user");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { loadInbox(); }, [user]);
  useEffect(() => { loadChat(otherUserId); }, [otherUserId, conversations]);

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
      setError(err.message);
    }
  };

  return (
    <div style={page}>
      <h1>Messages</h1>
      <p style={{ color: colors.muted, marginBottom: '20px' }}>Chat with stadium owners and match organizers.</p>

      {error && (
        <div style={{
          padding: '10px 12px',
          background: '#fef2f2',
          color: colors.danger,
          borderRadius: '8px',
          marginBottom: '12px'
        }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Inbox */}
        <div style={{ ...card, flex: '1 1 260px', minWidth: '260px' }}>
          <h3 style={{ marginTop: 0 }}>Conversations</h3>
          {conversations.length === 0 && <p style={{ color: colors.muted }}>No conversations yet.</p>}
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => setOtherUserId(c.id)}
              style={{
                padding: '10px 12px',
                marginBottom: '6px',
                background: otherUserId === c.id ? '#eef3ff' : '#f8f9fa',
                borderRadius: '10px',
                cursor: 'pointer',
                border: '1px solid ' + (otherUserId === c.id ? colors.primary : 'transparent')
              }}
            >
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: '13px', color: colors.muted }}>
                {c.lastMessage.length > 30 ? c.lastMessage.substring(0, 30) + '...' : c.lastMessage}
              </div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div style={{ ...card, flex: '2 1 400px', minWidth: '300px' }}>
          {!otherUserId ? (
            <p style={{ color: colors.muted }}>Pick a conversation, or start one from a stadium page.</p>
          ) : (
            <>
              <h3 style={{ marginTop: 0 }}>Chat with {otherUserName}</h3>
              <div style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '12px',
                background: '#fafafa',
                borderRadius: '10px',
                marginBottom: '12px'
              }}>
                {chat.length === 0 && <p style={{ color: colors.muted }}>No messages yet. Say hi!</p>}
                {chat.map(m => {
                  const mine = String(m.from._id) === user.id;
                  return (
                    <div key={m._id} style={{ textAlign: mine ? 'right' : 'left', margin: '6px 0' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '8px 14px',
                        borderRadius: '16px',
                        background: mine ? colors.primary : '#e9ecef',
                        color: mine ? 'white' : colors.text,
                        maxWidth: '70%',
                        textAlign: 'left'
                      }}>
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  style={{ ...input, flex: 1 }}
                />
                <button type="submit" style={button.primary}>Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;

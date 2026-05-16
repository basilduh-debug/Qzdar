import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [otherUserId, setOtherUserId] = useState(searchParams.get("to") || "");
  const [otherUserName, setOtherUserName] = useState("");
  const [conversations, setConversations] = useState([]);
  const [chat, setChat] = useState([]);
  const [text, setText] = useState("");

  // Build the inbox: distinct users I've exchanged messages with
  const loadInbox = () => {
    const raw = localStorage.getItem("soccerBooker_messages") || "[]";
    const all = JSON.parse(raw);

    const mine = all.filter(m => m.fromId === user.id || m.toId === user.id);
    mine.sort((a, b) => b.createdAt - a.createdAt);

    const seen = new Set();
    const inbox = [];
    for (const m of mine) {
      const otherId = m.fromId === user.id ? m.toId : m.fromId;
      const otherName = m.fromId === user.id ? m.toName : m.fromName;
      if (!seen.has(otherId)) {
        seen.add(otherId);
        inbox.push({ id: otherId, name: otherName, lastMessage: m.text, when: m.createdAt });
      }
    }

    setConversations(inbox);
  };

  // Load the chat history with one specific user
  const loadChat = (withUserId) => {
    if (!withUserId) {
      setChat([]);
      setOtherUserName("");
      return;
    }

    const raw = localStorage.getItem("soccerBooker_messages") || "[]";
    const all = JSON.parse(raw);
    const thread = all.filter(m =>
      (m.fromId === user.id && m.toId === withUserId) ||
      (m.fromId === withUserId && m.toId === user.id)
    ).sort((a, b) => a.createdAt - b.createdAt);

    setChat(thread);

    // Figure out the other user's display name
    if (thread.length > 0) {
      const sample = thread[0];
      const name = sample.fromId === user.id ? sample.toName : sample.fromName;
      setOtherUserName(name);
    } else {
      // No messages yet — look the user up in the users database
      const usersRaw = localStorage.getItem("soccerBooker_users") || "[]";
      const users = JSON.parse(usersRaw);
      const other = users.find(u => u.id === withUserId);
      setOtherUserName(other?.username || "Unknown user");
    }
  };

  useEffect(() => {
    loadInbox();
  }, [user]);

  useEffect(() => {
    loadChat(otherUserId);
  }, [otherUserId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!otherUserId || !text.trim()) return;

    const raw = localStorage.getItem("soccerBooker_messages") || "[]";
    const all = JSON.parse(raw);

    const newMsg = {
      id: "msg_" + Date.now(),
      fromId: user.id,
      fromName: user.name,
      toId: otherUserId,
      toName: otherUserName,
      text: text.trim(),
      createdAt: Date.now()
    };

    all.push(newMsg);
    localStorage.setItem("soccerBooker_messages", JSON.stringify(all));

    setText("");
    loadChat(otherUserId);
    loadInbox();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Messages</h1>

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
                    key={m.id}
                    style={{
                      textAlign: m.fromId === user.id ? 'right' : 'left',
                      margin: '6px 0'
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: m.fromId === user.id ? '#007bff' : '#e0e0e0',
                        color: m.fromId === user.id ? 'white' : 'black',
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

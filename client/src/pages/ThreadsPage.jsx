import ChatRoom from "../components/ChatRoom.jsx";

const DEMO_THREADS = [
  { id: 1, title: "How does SSE differ from WebSockets?", author: "Ada", replies: 4 },
  { id: 2, title: "Best practices for JWT refresh tokens", author: "Linus", replies: 2 },
];

export default function ThreadsPage() {
  return (
    <div className="threads-page">
      <div className="threads-list">
        <h2>Thread Discussion</h2>
        {DEMO_THREADS.map((t) => (
          <div key={t.id} className="thread-item">
            <strong>{t.title}</strong>
            <p className="byline">by {t.author} &middot; {t.replies} replies</p>
          </div>
        ))}
      </div>

      <ChatRoom roomId="thread-1" />
    </div>
  );
}

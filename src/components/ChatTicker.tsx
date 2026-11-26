import { CHAT_LINES, emoteSrc, parseChatText } from '../chatLines'

function ChatLineItem({
  line,
  duplicate,
}: {
  line: (typeof CHAT_LINES)[number]
  duplicate?: boolean
}) {
  return (
    <li
      className={
        duplicate
          ? 'chat-ticker__line chat-ticker__dup'
          : 'chat-ticker__line'
      }
      aria-hidden={duplicate || undefined}
    >
      <span className="chat-ticker__user" style={{ color: line.color }}>
        {line.user}
      </span>
      <span className="chat-ticker__text">
        {parseChatText(line.text).map((part, j) =>
          part.type === 'emote' ? (
            <img
              key={j}
              className="chat-ticker__emote"
              src={emoteSrc(part.name)}
              alt={duplicate ? '' : part.name}
              title={part.name}
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span key={j}>{part.value}</span>
          ),
        )}
      </span>
    </li>
  )
}

export function ChatTicker() {
  return (
    <aside className="chat-ticker" aria-label="Curated watch-party chat">
      <p className="chat-ticker__label">Chat</p>
      <div className="chat-ticker__viewport">
        <ul className="chat-ticker__track">
          {CHAT_LINES.map((line, i) => (
            <ChatLineItem key={`${line.user}-${i}`} line={line} />
          ))}
          {CHAT_LINES.map((line, i) => (
            <ChatLineItem
              key={`${line.user}-dup-${i}`}
              line={line}
              duplicate
            />
          ))}
        </ul>
      </div>
    </aside>
  )
}

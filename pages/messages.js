import { useState } from 'react';
import { Paperclip } from 'react-bootstrap-icons';
import { useMessages, getMessageDetail } from '@/lib/messages';
import { decodeAndCleanHtml, formatDate } from '@/lib/utils';
import Layout from '@/components/layout';

const MessagesPage = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [focusedMessage, setFocusedMessage] = useState(null);

  const messagesPerPage = parseInt(localStorage.getItem('messagesPageLimit')) || 5;
  const { data: messagesData, loading, error } = useMessages(messagesPerPage, pageNumber);

  // Inicjalizacja zmiennych z odpowiednim scope
  const total = messagesData?.total || 0;
  const totalPages = Math.ceil(total / messagesPerPage);

  // Funkcja do pobierania szczegółów wiadomości
  const handleReadMore = async (message) => {
    try {
      const { messageDetail, messageDetailLoading, messageDetailError } = await getMessageDetail(message.messageId);
      if (messageDetailError) throw new Error(messageDetailError);
      setFocusedMessage(messageDetail);
      const modal = document.getElementById("message_modal");
      if (modal) modal.classList.remove('hidden');
    } catch (err) {
      console.error('Error fetching message details:', err);
    }
  };

  // Funkcje nawigacji między stronami
  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  // MessageModal component displays a modal with message details
  const MessageModal = () => focusedMessage && (
    // Outer container for the modal with backdrop
    <div
      id="message_modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => {
        setFocusedMessage(null);
        document.getElementById("message_modal")?.classList.add('hidden');
      }}
    >
      {/* Inner modal container with scrollable content */}
      <div
        className="relative w-11/12 max-w-4xl bg-base-100 rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Message subject */}
        <h3 className="font-bold text-2xl text-base-content mb-2">
          {focusedMessage.topic}
        </h3>

        {/* Message metadata (sender and date) */}
        <div className="flex flex-row items-center gap-x-2 text-sm text-base-content/70">
          <span>{focusedMessage.senderName}</span>
          <span>-</span>
          <span>{formatDate(focusedMessage.sendDate)}</span>
        </div>

        {/* Message content */}
        <p className="py-4 text-base-content/80 min-h-[100px]">
          <MessageComponent message={focusedMessage.Message} />
        </p>

        {/* Attachment information, if present */}
        {focusedMessage.isAnyFileAttached && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg text-base-content/60">
              <Paperclip />
            </span>
            <span className="text-sm font-medium text-warning">
              This message has an attachment. This app does not support attachments.
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <MessageModal />

      <div className="space-y-4">
        <span className="text-3xl font-semibold">Messages</span>

        {/* Lista wiadomości */}
        <div className="flex flex-col gap-2">
          {loading ? (
            Array(3).fill().map((_, i) => (
              <div key={i} className="skeleton h-24 w-full"></div>
            ))
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : messagesData?.data?.length ? (
            messagesData.data.map((message) => (
              <div
                key={message.messageId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-base-200 rounded-box gap-2 p-4 cursor-pointer hover:bg-base-300 transition-colors duration-200"
                onClick={() => handleReadMore(message)}
              >
                <div className="flex flex-col gap-1 w-full">
                  {/* Temat wiadomości */}
                  <span className="text-lg font-bold text-base-content">
                    {message.topic}
                  </span>

                  {/* Metadane wiadomości */}
                  <div className="flex flex-row items-center gap-x-2 text-sm text-base-content/70">
                    <span>{message.senderName}</span>
                    <span>-</span>
                    <span>{formatDate(message.sendDate)}</span>
                  </div>

                  {/* Treść wiadomości */}
                  <span className="text-base-content/80">
                    <MessageComponent message={message.content} />
                  </span>

                  {/* Ikona załącznika */}
                  {(localStorage.getItem('developer') === 'true' || message.isAnyFileAttached) && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-lg text-base-content/60">
                        <Paperclip />
                      </span>
                      {message.isAnyFileAttached && (
                        <span className="text-sm font-medium text-warning">
                          This message has an attachment. This app does not support attachments.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No messages found</div>
          )}
        </div>

        {/* Nawigacja */}
        <div className="join flex justify-center gap-2">
          <button
            onClick={handlePreviousPage}
            className="join-item btn btn-outline"
            disabled={pageNumber === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="join-item btn btn-outline"
            disabled={pageNumber >= totalPages}
          >
            Next
          </button>
        </div>

        {/* Informacje dla deweloperów */}
        {localStorage.getItem('developer') === 'true' && (
          <div className="text-center text-sm font-semibold">
            Total Messages: {total} | Page {pageNumber} of {totalPages}
          </div>
        )}
      </div>
    </Layout>
  );
};


// Main component that renders the message
const MessageComponent = ({ message, withBreaks = true }) => {
  return (
    <p
      dangerouslySetInnerHTML={{ __html: decodeAndCleanHtml(message, withBreaks) }}
    />
  );
};

export default MessagesPage;

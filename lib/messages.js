import { fetch } from "@tauri-apps/plugin-http";
import { useState, useEffect } from 'react';

// Constants
const API_URL = 'https://wiadomosci.librus.pl/api/';
let isAuthenticated = false;

/**
 * Attempts to authenticate with the Synergia API
 * @returns {Promise<boolean>} Authentication success status
 */
const authenticate = async () => {
  if (isAuthenticated) return true;

  try {
    const response = await fetch("https://synergia.librus.pl/wiadomosci3");
    if (!response.ok) {
      throw new Error(`Authentication failed with status: ${response.status}`);
    }
    isAuthenticated = true;
    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
};

/**
 * Fetches messages from the API with pagination
 * @param {number} [maxMsgOnPage] - Maximum messages per page
 * @param {number} [page] - Page number
 * @returns {Promise<object|null>} Messages data or null if failed
 */
const getMessages = async (maxMsgOnPage, page) => {
  if (!(await authenticate())) return null;

  const queryParams = new URLSearchParams(
    Object.entries({
      limit: maxMsgOnPage,
      page: page
    }).filter(([, value]) => value !== undefined)
  ).toString();

  try {
    const response = await fetch(`${API_URL}inbox/messages${queryParams ? `?${queryParams}` : ""}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Messages fetch error: ${error.message}`);
  }
};

/**
 * Fetches details for a specific message
 * @param {string} messageId - The ID of the message to fetch
 * @returns {Promise<object>} Message details
 * @throws {Error} If fetch fails or response is invalid
 */
const fetchMessageDetail = async (messageId) => {
  if (!(await authenticate())) {
    throw new Error("Authentication required");
  }

  try {
    const response = await fetch(`${API_URL}inbox/messages/${messageId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    if (!jsonResponse?.data) {
      throw new Error('Invalid response format: No data found');
    }

    return jsonResponse.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Custom hook to manage messages state and fetching
 * @param {number} [maxMsgOnPage] - Maximum messages per page
 * @param {number} [page] - Page number
 * @returns {object} Messages state with data, loading, and error
 */
const useMessages = (maxMsgOnPage, page) => {
  const [messagesData, setMessagesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const messages = await getMessages(maxMsgOnPage, page);
        if (isMounted) {
          setMessagesData(messages);
        }
      } catch (err) {
        if (isMounted) {
          setError(`Error fetching messages: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [maxMsgOnPage, page]);

  return { data: messagesData, loading, error };
};

/**
 * Gets detailed information for a specific message
 * @param {string} messageId - The ID of the message
 * @returns {Promise<object>} Object containing message details, loading state, and error
 */
const getMessageDetail = async (messageId) => {
  if (!messageId) {
    return { 
      messageDetail: null, 
      loading: false, 
      error: "Message ID is required" 
    };
  }

  try {
    const data = await fetchMessageDetail(messageId);
    return { 
      messageDetail: data, 
      loading: false, 
      error: null 
    };
  } catch (err) {
    return { 
      messageDetail: null, 
      loading: false, 
      error: `Failed to fetch message details: ${err.message}` 
    };
  }
};

export { getMessages, fetchMessageDetail, useMessages, getMessageDetail };